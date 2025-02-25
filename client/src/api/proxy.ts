import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const API_KEY = process.env.VITE_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: "API key missing" });
  }
  try {
    const baseUrl = "https://api.themoviedb.org/3";
    const endpoint = req.url?.replace("/api/tmdb/", "");
    const queryParams = new URLSearchParams({
      ...req.query,
      api_key: API_KEY,
    } as Record<string, string>);

    const response = await fetch(`${baseUrl}/${endpoint}?${queryParams}`);
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
