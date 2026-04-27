import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Chemins relatifs : permet d'héberger dans n'importe quel sous-dossier
  // (monsite.fr/jeu/) ou même d'ouvrir dist/index.html en file:// pour tester.
  base: "./",
  server: { host: true, port: 5173 },
  preview: { host: true, port: 4173 },
});
