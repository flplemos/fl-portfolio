import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Preload the two self-hosted latin variable fonts so text swaps to them as early as
// possible (the other unicode-range subsets are only fetched if a page ever needs them).
const preloadFonts = () => ({
  name: 'preload-fonts',
  transformIndexHtml(_html, ctx) {
    if (!ctx.bundle) return
    return Object.keys(ctx.bundle)
      .filter((file) => /-latin-wght-normal-[\w-]+\.woff2$/.test(file))
      .map((file) => ({
        tag: 'link',
        attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `/${file}`, crossorigin: '' },
        injectTo: 'head',
      }))
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), preloadFonts()],
})
