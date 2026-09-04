/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { injectRoute, homeRoute } from './src/seo/render.js'

/**
 * Injects the home page's <head> metadata and crawlable static content into
 * index.html (dev server and build). scripts/prerender.mjs reuses the same
 * renderer to derive every other route after the build.
 */
export function seoHtml() {
  return {
    name: 'mathsheets-seo-html',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return injectRoute(html, homeRoute())
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
