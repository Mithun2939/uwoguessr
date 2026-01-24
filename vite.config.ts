import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Use / for Vercel (uwoguessr.com). Use /uwoguessr/ only if deploying to GitHub Pages.
  base: '/',
})