import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Cloudflare Pages serves the site at the domain root, so the base path is '/'.
// Override with BASE_PATH for sub-path hosting (e.g. a GitHub project page,
// which would need BASE_PATH=/calendar-events/).
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
});
