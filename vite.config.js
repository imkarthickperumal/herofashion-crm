import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon-96x96.png",
        "apple-touch-icon.png",
        "icons/android-chrome-192x192.png",
        "icons/android-chrome-512x512.png",
      ],
      manifest: {
        name: "Hero Fashion",
        short_name: "HeroFashion",
        description: "Garment Industry SaaS App",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#7cb547",
        icons: [
          {
            src: "/icons/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icons/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],

  server: {
    proxy: {
      "/dhana": {
        target: "https://roll.herofashion.com:883",
        changeOrigin: true,
        secure: false,
      },
      "/overall": {
        target: "http://103.125.155.133:7005",
        changeOrigin: true,
        secure: false,
      },
      "/empwise": {
        target: "http://103.125.155.133:7005",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
