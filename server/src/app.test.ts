// @vitest-environment node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import Database from "better-sqlite3";
import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";
import { createApp } from "./app";
import { resetCachedDatabase } from "./db";

const tempDbPath = path.join(os.tmpdir(), `maison-lumiere-test-${process.pid}.sqlite`);

afterEach(() => {
  resetCachedDatabase();
  if (fs.existsSync(tempDbPath)) {
    fs.rmSync(tempDbPath, { force: true });
  }
});

describe("Maison Lumiere API", () => {
  it("serves site content and catalog data", async () => {
    const app = createApp({ dbPath: tempDbPath, disableRateLimit: true });

    const [contentResponse, productsResponse, configuratorResponse] = await Promise.all([
      request(app).get("/api/content/site"),
      request(app).get("/api/products"),
      request(app).get("/api/configurator/options"),
    ]);

    expect(contentResponse.status).toBe(200);
    expect(contentResponse.body.hero.accent).toBe("Timeless");
    expect(contentResponse.body.materials.items).toHaveLength(4);

    expect(productsResponse.status).toBe(200);
    expect(productsResponse.body).toHaveLength(4);
    expect(productsResponse.body[0].id).toBe("chair");

    expect(configuratorResponse.status).toBe(200);
    expect(configuratorResponse.body.colors).toHaveLength(4);
    expect(configuratorResponse.body.section.basePrice).toBe(8400);
  });

  it("persists inquiries", async () => {
    const app = createApp({ dbPath: tempDbPath, disableRateLimit: true });

    const response = await request(app).post("/api/inquiries").send({
      source: "configurator",
      name: "Amina Yusuf",
      email: "amina@example.com",
      message: "Please contact me about this configuration.",
      context: "Aurelia · Oxblood leather · Brushed Brass legs · Signature",
      configSummary: "Aurelia · Oxblood leather · Brushed Brass legs · Signature",
      configSelection: {
        colorId: "oxblood",
        legId: "brass",
        sizeId: "signature",
      },
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toContain("Your request has been received");

    const db = new Database(tempDbPath);
    const inquiry = db
      .prepare(
        "SELECT source, name, email, config_summary AS configSummary FROM inquiries ORDER BY id DESC LIMIT 1",
      )
      .get() as {
      source: string;
      name: string;
      email: string;
      configSummary: string;
    };

    expect(inquiry.source).toBe("configurator");
    expect(inquiry.name).toBe("Amina Yusuf");
    expect(inquiry.email).toBe("amina@example.com");
    expect(inquiry.configSummary).toContain("Aurelia");
    db.close();
  });

  it("rejects incomplete inquiries", async () => {
    const app = createApp({ dbPath: tempDbPath, disableRateLimit: true });

    const response = await request(app).post("/api/inquiries").send({
      source: "product",
      name: "",
      email: "not-an-email",
      productId: "chair",
    });

    expect(response.status).toBe(400);
    expect(response.body.fieldErrors.name).toBeDefined();
    expect(response.body.fieldErrors.email).toBeDefined();
  });
});
