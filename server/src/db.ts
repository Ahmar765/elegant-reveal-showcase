import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import {
  configurator,
  materials,
  pressMentions,
  products,
  rooms,
  siteSections,
  testimonials,
} from "./seedData";

const DEFAULT_DB_PATH = path.resolve(process.cwd(), "server", "data", "maison-lumiere.sqlite");
type DatabaseInstance = InstanceType<typeof Database>;

let cachedDb: DatabaseInstance | null = null;
let cachedDbPath: string | null = null;

function createTables(db: DatabaseInstance) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS site_sections (
      key TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price_label TEXT NOT NULL,
      price_value INTEGER NOT NULL,
      image_key TEXT NOT NULL,
      year TEXT NOT NULL,
      description TEXT NOT NULL,
      materials TEXT NOT NULL,
      lead_time TEXT NOT NULL,
      edition TEXT NOT NULL,
      sort_order INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS configurator_meta (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      eyebrow TEXT NOT NULL,
      title TEXT NOT NULL,
      accent TEXT NOT NULL,
      reserve_label TEXT NOT NULL,
      preview_label TEXT NOT NULL,
      base_price INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS configurator_colors (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      hex TEXT NOT NULL,
      image_key TEXT NOT NULL,
      sort_order INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS configurator_legs (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      hex TEXT NOT NULL,
      sort_order INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS configurator_sizes (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      scale REAL NOT NULL,
      sort_order INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS materials (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      origin TEXT NOT NULL,
      note TEXT NOT NULL,
      image_key TEXT NOT NULL,
      sort_order INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS rooms (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT NOT NULL,
      sort_order INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id TEXT PRIMARY KEY,
      quote TEXT NOT NULL,
      author TEXT NOT NULL,
      role TEXT NOT NULL,
      sort_order INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS press_mentions (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      sort_order INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      context TEXT,
      product_id TEXT,
      product_name TEXT,
      config_summary TEXT,
      config_payload TEXT,
      status TEXT NOT NULL DEFAULT 'new',
      created_at TEXT NOT NULL
    );
  `);
}

function seedDatabase(db: DatabaseInstance) {
  const now = new Date().toISOString();
  const tableCount = db.prepare("SELECT COUNT(*) AS count FROM site_sections").get() as { count: number };
  if (tableCount.count > 0) {
    return;
  }

  const insertSection = db.prepare(
    "INSERT INTO site_sections (key, content, updated_at) VALUES (@key, @content, @updatedAt)",
  );
  const insertProduct = db.prepare(`
    INSERT INTO products (
      id, name, category, price_label, price_value, image_key, year, description, materials, lead_time, edition, sort_order
    ) VALUES (
      @id, @name, @category, @priceLabel, @priceValue, @imageKey, @year, @description, @materials, @leadTime, @edition, @sortOrder
    )
  `);
  const insertConfiguratorMeta = db.prepare(`
    INSERT INTO configurator_meta (id, eyebrow, title, accent, reserve_label, preview_label, base_price)
    VALUES (1, @eyebrow, @title, @accent, @reserveLabel, @previewLabel, @basePrice)
  `);
  const insertColor = db.prepare(`
    INSERT INTO configurator_colors (id, label, hex, image_key, sort_order)
    VALUES (@id, @label, @hex, @imageKey, @sortOrder)
  `);
  const insertLeg = db.prepare(`
    INSERT INTO configurator_legs (id, label, hex, sort_order)
    VALUES (@id, @label, @hex, @sortOrder)
  `);
  const insertSize = db.prepare(`
    INSERT INTO configurator_sizes (id, label, scale, sort_order)
    VALUES (@id, @label, @scale, @sortOrder)
  `);
  const insertMaterial = db.prepare(`
    INSERT INTO materials (id, name, origin, note, image_key, sort_order)
    VALUES (@id, @name, @origin, @note, @imageKey, @sortOrder)
  `);
  const insertRoom = db.prepare(`
    INSERT INTO rooms (id, title, location, description, image_url, sort_order)
    VALUES (@id, @title, @location, @description, @imageUrl, @sortOrder)
  `);
  const insertTestimonial = db.prepare(`
    INSERT INTO testimonials (id, quote, author, role, sort_order)
    VALUES (@id, @quote, @author, @role, @sortOrder)
  `);
  const insertPressMention = db.prepare(`
    INSERT INTO press_mentions (id, label, sort_order)
    VALUES (@id, @label, @sortOrder)
  `);

  const transaction = db.transaction(() => {
    for (const [key, content] of Object.entries(siteSections)) {
      insertSection.run({
        key,
        content: JSON.stringify(content),
        updatedAt: now,
      });
    }

    for (const product of products) {
      insertProduct.run(product);
    }

    insertConfiguratorMeta.run(configurator.section);

    for (const color of configurator.colors) {
      insertColor.run(color);
    }

    for (const leg of configurator.legs) {
      insertLeg.run(leg);
    }

    for (const size of configurator.sizes) {
      insertSize.run(size);
    }

    for (const material of materials) {
      insertMaterial.run(material);
    }

    for (const room of rooms) {
      insertRoom.run(room);
    }

    for (const testimonial of testimonials) {
      insertTestimonial.run(testimonial);
    }

    for (const pressMention of pressMentions) {
      insertPressMention.run(pressMention);
    }
  });

  transaction();
}

export function initializeDatabase(dbPath = process.env.DB_PATH ?? DEFAULT_DB_PATH) {
  const resolvedPath = path.resolve(dbPath);
  if (cachedDb && cachedDbPath === resolvedPath) {
    return cachedDb;
  }

  fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });

  const db = new Database(resolvedPath);
  db.pragma("journal_mode = WAL");
  createTables(db);
  seedDatabase(db);

  cachedDb = db;
  cachedDbPath = resolvedPath;
  return db;
}

export function resetCachedDatabase() {
  if (cachedDb) {
    cachedDb.close();
  }
  cachedDb = null;
  cachedDbPath = null;
}
