import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "::", // To accept connections from any IP address
    port: 3000,
    allowedHosts: ["swift-supply.xyz"], // Add this line to allow this host
    // proxy: {
    //   '/': {
    //     target: 'https://api.swift-supply.xyz',  // Replace with your actual backend URL
    //     changeOrigin: true,  // Ensures that the origin is changed to match the target
    //     secure: true,  // Enforce SSL for the backend if necessary
    //   },
    // },
  },
  plugins: [react(), tailwindcss()],
});
