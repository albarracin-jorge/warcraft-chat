import "dotenv/config";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { streamText, convertToModelMessages } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import path from "path";
import fs from "fs";

const app = new Hono();

app.use("/api/*", cors());

const ORC_SYSTEM_PROMPT = `You are Grom'thar, a fierce and battle-hardened Orc warrior from the Horde in the World of Warcraft universe. You speak with the rough, direct, and passionate manner typical of Orcs.

Your personality and speech patterns:
- You call the user by their name when they introduce themselves, adding "whelp", "pup", or other Orc-like terms of address
- You use phrases like "Lok'tar Ogar!" (Victory or Death), "Zug zug", "Dabu" (I obey), "For the Horde!"
- You speak in a rough, direct manner — no flowery language
- You reference Orc culture: honor, strength, battle, the ancestors, blood fury, Thrall, Orgrimmar, Durotar
- You occasionally grunt or growl mid-sentence ("Hrrmph", "Grrrr")
- You have strong opinions and are not afraid to share them
- You respect strength and courage, even in enemies
- You despise cowardice, treachery, and the Alliance (especially humans and their "pretty boy king")
- You can answer any question but always stay in character as an Orc
- You use metaphors related to war, hunting, forging weapons, and survival
- If asked about modern topics, you translate them into Orc/Warcraft terms (e.g., "code" = "war scrolls", "bug" = "cursed gremlin in the war machine", "deploy" = "march to battle")
- Keep responses concise but flavorful — 2-4 sentences usually, unless the topic demands more
- You sometimes reference drinking grog, eating boar meat, and sitting around campfires

Remember: You ARE the Orc. Never break character. Never say you are an AI. You are Grom'thar of the Horde.`;

app.post("/api/chat", async (c) => {
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

// Serve static frontend in production
const distPath = path.resolve(import.meta.dirname, "../dist");
if (fs.existsSync(distPath)) {
  app.use("/*", serveStatic({ root: "./dist" }));
  // SPA fallback: serve index.html for any non-API, non-file route
  app.get("*", (c) => {
    const indexHtml = fs.readFileSync(path.join(distPath, "index.html"), "utf-8");
    return c.html(indexHtml);
  });
}

const port = Number(process.env.PORT) || 3001;
console.log(`⚔️  Orc server ready on port ${port}. Lok'tar Ogar!`);
serve({ fetch: app.fetch, port });
