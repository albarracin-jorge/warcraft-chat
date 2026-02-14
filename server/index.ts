import "dotenv/config";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { getCookie, setCookie } from "hono/cookie";
import { streamText, convertToModelMessages } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { ORC_SYSTEM_PROMPT } from "./prompts.ts";

const app = new Hono();

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:5173";

app.use("/api/*", cors({
  origin: ALLOWED_ORIGIN,
  credentials: true,
}));

app.get("/api/csrf-token", (c) => {
  const token = crypto.randomBytes(32).toString("hex");
  setCookie(c, "csrf_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    path: "/",
    maxAge: 60 * 60,
  });
  return c.json({ csrfToken: token });
});

app.post("/api/chat", async (c) => {
  const cookieToken = getCookie(c, "csrf_token");
  const headerToken = c.req.header("x-csrf-token");

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return c.json({ error: "Invalid CSRF token" }, 403);
  }

  const body = await c.req.json();
  const { messages } = body;

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: anthropic("claude-haiku-4-5-20251001"),
    system: ORC_SYSTEM_PROMPT,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
});

const distPath = path.resolve(import.meta.dirname, "../dist");
if (fs.existsSync(distPath)) {
  app.use("/*", serveStatic({ root: "./dist" }));
  app.get("*", (c) => {
    const indexHtml = fs.readFileSync(path.join(distPath, "index.html"), "utf-8");
    return c.html(indexHtml);
  });
}

const port = Number(process.env.PORT) || 3000;
console.log(`Server is running in port ${port}`);
serve({ fetch: app.fetch, port });
