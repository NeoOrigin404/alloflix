import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api/proxy": {
        target: "https://api.themoviedb.org/3",
        changeOrigin: true,
        rewrite: (path) => {
          const url = new URL(path, "http://localhost");
          const type = url.searchParams.get("type") || "";
          const params = Object.fromEntries(url.searchParams.entries());
          const { type: _, ...cleanParams } = params;

          cleanParams.api_key = process.env.VITE_API_KEY || "";

          const baseUrls: Record<string, string> = {
            "movie/popular": "/3/movie/popular",
            "movie/top_rated": "/3/movie/top_rated",
            // Ajoute d'autres types d'URL si nécessaire
          };

          const baseUrl = baseUrls[type] || "";

          return `${baseUrl}?${new URLSearchParams(cleanParams)}`;
        },
      },
    },
  },
});
