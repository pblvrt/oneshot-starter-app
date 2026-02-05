import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: { port: 3000, host: "0.0.0.0", allowedHosts: true },
  plugins: [
    viteTsConfigPaths(),
    tanstackStart({ target: "server" }),
    viteReact(),
    tailwindcss(),
  ],
});
