import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import { ZodError } from "zod";
import { initializeDatabase } from "./db";
import { inquirySchema } from "./validation";

type CreateAppOptions = {
  dbPath?: string;
  disableRateLimit?: boolean;
};

type SiteSectionRow = {
  key: string;
  content: string;
};

function getSiteSections(db: ReturnType<typeof initializeDatabase>) {
  const rows = db.prepare("SELECT key, content FROM site_sections").all() as SiteSectionRow[];
  return rows.reduce<Record<string, unknown>>((acc, row) => {
    acc[row.key] = JSON.parse(row.content);
    return acc;
  }, {});
}

function getProducts(db: ReturnType<typeof initializeDatabase>) {
  return db
    .prepare(
      `SELECT
        id,
        name,
        category,
        price_label AS priceLabel,
        price_value AS priceValue,
        image_key AS imageKey,
        year,
        description,
        materials,
        lead_time AS leadTime,
        edition
      FROM products
      ORDER BY sort_order ASC`,
    )
    .all();
}

function getProductById(db: ReturnType<typeof initializeDatabase>, id: string) {
  return (
    db
      .prepare(
        `SELECT
          id,
          name,
          category,
          price_label AS priceLabel,
          price_value AS priceValue,
          image_key AS imageKey,
          year,
          description,
          materials,
          lead_time AS leadTime,
          edition
        FROM products
        WHERE id = ?`,
      )
      .get(id) ?? null
  );
}

function getConfiguratorOptions(db: ReturnType<typeof initializeDatabase>) {
  const section =
    db
      .prepare(
        `SELECT
          eyebrow,
          title,
          accent,
          reserve_label AS reserveLabel,
          preview_label AS previewLabel,
          base_price AS basePrice
        FROM configurator_meta
        WHERE id = 1`,
      )
      .get() ?? null;

  const colors = db
    .prepare(
      `SELECT
        id,
        label,
        hex,
        image_key AS imageKey
      FROM configurator_colors
      ORDER BY sort_order ASC`,
    )
    .all();
  const legs = db
    .prepare(
      `SELECT
        id,
        label,
        hex
      FROM configurator_legs
      ORDER BY sort_order ASC`,
    )
    .all();
  const sizes = db
    .prepare(
      `SELECT
        id,
        label,
        scale
      FROM configurator_sizes
      ORDER BY sort_order ASC`,
    )
    .all();

  return {
    section,
    colors,
    legs,
    sizes,
  };
}

function getMaterials(db: ReturnType<typeof initializeDatabase>) {
  return db
    .prepare(
      `SELECT
        id,
        name,
        origin,
        note,
        image_key AS imageKey
      FROM materials
      ORDER BY sort_order ASC`,
    )
    .all();
}

function getRooms(db: ReturnType<typeof initializeDatabase>) {
  return db
    .prepare(
      `SELECT
        id,
        title,
        location,
        description,
        image_url AS imageUrl
      FROM rooms
      ORDER BY sort_order ASC`,
    )
    .all();
}

function getTestimonials(db: ReturnType<typeof initializeDatabase>) {
  return db
    .prepare(
      `SELECT
        id,
        quote,
        author,
        role
      FROM testimonials
      ORDER BY sort_order ASC`,
    )
    .all();
}

function getPressMentions(db: ReturnType<typeof initializeDatabase>) {
  return db
    .prepare(
      `SELECT
        id,
        label
      FROM press_mentions
      ORDER BY sort_order ASC`,
    )
    .all();
}

function getSectionPayload(db: ReturnType<typeof initializeDatabase>, sectionKey: string) {
  const sections = getSiteSections(db);

  switch (sectionKey) {
    case "hero":
    case "gallery":
    case "navigation":
    case "cta":
    case "footer":
      return sections[sectionKey] ?? null;
    case "materials":
      return {
        ...(sections.materials as object),
        items: getMaterials(db),
      };
    case "rooms":
      return {
        ...(sections.rooms as object),
        items: getRooms(db),
      };
    case "testimonials":
      return {
        ...(sections.testimonials as object),
        items: getTestimonials(db),
        press: getPressMentions(db),
      };
    default:
      return null;
  }
}

function getSiteContent(db: ReturnType<typeof initializeDatabase>) {
  const sections = getSiteSections(db);
  return {
    navigation: sections.navigation,
    hero: sections.hero,
    gallery: sections.gallery,
    materials: {
      ...(sections.materials as object),
      items: getMaterials(db),
    },
    rooms: {
      ...(sections.rooms as object),
      items: getRooms(db),
    },
    testimonials: {
      ...(sections.testimonials as object),
      items: getTestimonials(db),
      press: getPressMentions(db),
    },
    cta: sections.cta,
    footer: sections.footer,
  };
}

export function createApp(options: CreateAppOptions = {}) {
  const db = initializeDatabase(options.dbPath);
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  const inquiryRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      message: "Too many inquiry submissions. Please wait a few minutes and try again.",
    },
  });

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/content/site", (_req, res) => {
    res.json(getSiteContent(db));
  });

  app.get("/api/content/:sectionKey", (req, res) => {
    const payload = getSectionPayload(db, req.params.sectionKey);
    if (!payload) {
      return res.status(404).json({ message: "Content section not found." });
    }

    return res.json(payload);
  });

  app.get("/api/products", (_req, res) => {
    res.json(getProducts(db));
  });

  app.get("/api/products/:id", (req, res) => {
    const product = getProductById(db, req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    return res.json(product);
  });

  app.get("/api/configurator/options", (_req, res) => {
    res.json(getConfiguratorOptions(db));
  });

  app.post(
    "/api/inquiries",
    options.disableRateLimit ? (_req, _res, next) => next() : inquiryRateLimit,
    (req, res, next) => {
      try {
        const parsed = inquirySchema.parse(req.body);

        if (parsed.productId) {
          const product = getProductById(db, parsed.productId);
          if (!product) {
            return res.status(400).json({ message: "The selected product could not be found." });
          }
        }

        if (parsed.configSelection) {
          const colorExists = db
            .prepare("SELECT 1 FROM configurator_colors WHERE id = ?")
            .get(parsed.configSelection.colorId);
          const legExists = db
            .prepare("SELECT 1 FROM configurator_legs WHERE id = ?")
            .get(parsed.configSelection.legId);
          const sizeExists = db
            .prepare("SELECT 1 FROM configurator_sizes WHERE id = ?")
            .get(parsed.configSelection.sizeId);

          if (!colorExists || !legExists || !sizeExists) {
            return res.status(400).json({ message: "One or more configurator options are invalid." });
          }
        }

        const result = db
          .prepare(
            `INSERT INTO inquiries (
              source,
              name,
              email,
              message,
              context,
              product_id,
              product_name,
              config_summary,
              config_payload,
              created_at
            ) VALUES (
              @source,
              @name,
              @email,
              @message,
              @context,
              @productId,
              @productName,
              @configSummary,
              @configPayload,
              @createdAt
            )`,
          )
          .run({
            source: parsed.source,
            name: parsed.name,
            email: parsed.email,
            message: parsed.message,
            context: parsed.context,
            productId: parsed.productId,
            productName: parsed.productName,
            configSummary: parsed.configSummary,
            configPayload: parsed.configSelection ? JSON.stringify(parsed.configSelection) : null,
            createdAt: new Date().toISOString(),
          });

        return res.status(201).json({
          id: result.lastInsertRowid,
          message: "Your request has been received. An atelier director will write to you within one business day.",
        });
      } catch (error) {
        return next(error);
      }
    },
  );

  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Please review the highlighted fields and try again.",
        fieldErrors: error.flatten().fieldErrors,
      });
    }

    console.error(error);
    return res.status(500).json({
      message: "Something went wrong while processing the request.",
    });
  });

  return app;
}
