import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

// Get directory name that works in both ESM and after bundling
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // In production, the server runs from dist/server.js
  // So __dirname points to dist/, and we need dist/public
  // Try multiple possible locations
  let distPath: string;
  
  // First try: dist/public (production - server bundled in dist/)
  const distPublic = path.resolve(__dirname, "public");
  // Second try: relative to process.cwd() (fallback)
  const cwdPublic = path.resolve(process.cwd(), "dist", "public");
  
  if (fs.existsSync(distPublic)) {
    distPath = distPublic;
  } else if (fs.existsSync(cwdPublic)) {
    distPath = cwdPublic;
  } else {
    // Last resort: try client/dist (for Netlify-like setups)
    const clientDist = path.resolve(process.cwd(), "client", "dist");
    if (fs.existsSync(clientDist)) {
      distPath = clientDist;
    } else {
      distPath = distPublic; // Use default even if it doesn't exist
      console.error(
        `Could not find the build directory. Tried:\n` +
        `  - ${distPublic}\n` +
        `  - ${cwdPublic}\n` +
        `  - ${clientDist}\n` +
        `Using: ${distPath}\n` +
        `Make sure to build the client first with: pnpm build:client`
      );
    }
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
