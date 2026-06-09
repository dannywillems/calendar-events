import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Repo name lives here in one place. For a project Pages site the app is served
// from https://<user>.github.io/<REPO>/, so the base path must match the repo.
// Override at build time with BASE_PATH=/ for a user/org page or custom domain.
const REPO = 'calendar-events';
const base = process.env.BASE_PATH ?? `/${REPO}/`;

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
});
