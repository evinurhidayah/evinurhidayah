// Simple dev server to proxy Brave Search API requests
// Run with: node dev-proxy.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// Load .env.local file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, ".env.local") });

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post("/api/search", async (req, res) => {
  try {
    const { query, count = 5 } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const apiKey = process.env.BRAVE_SEARCH_API_KEY;

    if (!apiKey) {
      console.error("BRAVE_SEARCH_API_KEY not found in .env.local");
      return res.status(500).json({ error: "API key not configured" });
    }

    const url = new URL("https://api.search.brave.com/res/v1/web/search");
    url.searchParams.append("q", query);
    url.searchParams.append("count", Math.min(count, 10).toString());
    url.searchParams.append("country", "ID"); // Indonesia region
    url.searchParams.append("search_lang", "en"); // API language (not supported: id)
    url.searchParams.append("text_decorations", "false");

    console.log(`🔍 Searching: "${query}"`);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-Subscription-Token": apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Brave API error: ${response.status}`, errorText);
      return res.status(response.status).json({
        error: "Search failed",
        details: errorText,
      });
    }

    const data = await response.json();

    if (!data.web?.results) {
      console.log("⚠️ No results found");
      return res.json({ results: [] });
    }

    const results = data.web.results.map((result) => ({
      title: result.title,
      url: result.url,
      snippet: result.description,
    }));

    console.log(`✅ Found ${results.length} results`);
    res.json({ results });
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Dev proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Proxying requests to Brave Search API`);
  console.log(
    `🔑 API Key loaded: ${process.env.BRAVE_SEARCH_API_KEY ? "✅" : "❌"}`
  );
});
