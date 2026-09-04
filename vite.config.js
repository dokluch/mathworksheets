/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { injectRoute, homeRoute, findRoute } from './src/seo/render.js'

/**
 * Injects <head> metadata and crawlable static content into index.html: the
 * requested route on the dev server, the home page at build time.
 * scripts/prerender.mjs reuses the same renderer to derive every other route
 * after the build.
 */
export function seoHtml() {
  return {
    name: 'mathsheets-seo-html',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const requested = ctx?.originalUrl ? findRoute(new URL(ctx.originalUrl, 'http://localhost').pathname) : null
        return injectRoute(html, requested || homeRoute())
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), seoHtml()],
  server: { port: 5176 },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{js,jsx}', 'scripts/**/*.test.{js,mjs}', '*.test.{js,mjs}'],
  },
})
