import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv, type Plugin } from "vite"

const deploymentMetadata = (mode: string): Plugin => {
  const configuredUrl = loadEnv(mode, process.cwd(), "").VITE_WEBSITE_URL?.trim()
  const siteUrl = configuredUrl ? new URL(configuredUrl).origin : undefined

  return {
    name: "deployment-metadata",
    generateBundle() {
      const robots = [
        "User-agent: *",
        "Allow: /",
        "Disallow: /admin",
        "Disallow: /api",
        "Disallow: /login",
        ...(siteUrl ? [`Sitemap: ${siteUrl}/sitemap.xml`] : []),
        "",
      ].join("\n")

      this.emitFile({ type: "asset", fileName: "robots.txt", source: robots })

      if (!siteUrl) return

      const publicPaths = ["/", "/ar", "/projects", "/ar/projects"]
      const sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...publicPaths.map((route) => `  <url><loc>${siteUrl}${route}</loc></url>`),
        "</urlset>",
        "",
      ].join("\n")

      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: sitemap })
    },
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    deploymentMetadata(mode),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  assetsInclude: ['**/*.md'],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'vendor-react';
            if (id.includes('@radix-ui')) return 'vendor-radix';
            if (id.includes('recharts')) return 'vendor-charts';
            if (id.includes('react-hook-form') || id.includes('zod')) return 'vendor-forms';
          }
          if (id.includes('LanguageContext')) return 'app-i18n';
        },
      },
    },
    chunkSizeWarningLimit: 200,
  },
}))