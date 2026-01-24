import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Vercel serves from root; GitHub Pages uses /uwoguessr/
  base: process.env.VERCEL ? '/' : (process.env.NODE_ENV === 'production' ? '/uwoguessr/' : '/'),
})