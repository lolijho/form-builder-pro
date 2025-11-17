import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

// Get directory name that works in both ESM and after bundling
// After esbuild bundling, import.meta.url is not reliable, so we always use process.cwd()
// This is safer and works in both development and production
// In Railway, the working directory is /app, and dist/ is at /app/dist
const __dirname = process.cwd();

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
  // After bundling, __dirname might be undefined, so we use process.cwd() as fallback
  // Try multiple possible locations
  let distPath: string;
  
  const cwd = process.cwd();
  
  // First try: dist/public (production - server bundled in dist/)
  // If __dirname is valid and points to dist/, use it
  let distPublic: string;
  if (__dirname && __dirname !== cwd) {
    distPublic = path.resolve(__dirname, "public");
  } else {
    distPublic = path.resolve(cwd, "dist", "public");
  }
  
  // Second try: relative to process.cwd() (fallback)
  const cwdPublic = path.resolve(cwd, "dist", "public");
  
  // Third try: client/dist (for Netlify-like setups)
  const clientDist = path.resolve(cwd, "client", "dist");
  
  if (fs.existsSync(distPublic)) {
    distPath = distPublic;
  } else if (fs.existsSync(cwdPublic)) {
    distPath = cwdPublic;
  } else if (fs.existsSync(clientDist)) {
    distPath = clientDist;
  } else {
    distPath = cwdPublic; // Use default even if it doesn't exist
    console.error(
      `Could not find the build directory. Tried:\n` +
      `  - ${distPublic}\n` +
      `  - ${cwdPublic}\n` +
      `  - ${clientDist}\n` +
      `Current working directory: ${cwd}\n` +
      `__dirname: ${__dirname}\n` +
      `Using: ${distPath}\n` +
      `Make sure to build the client first with: pnpm build:client`
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
