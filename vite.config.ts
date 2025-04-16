import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
});


// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "path";

// export default async function () {
//   const plugins = [
//     react(),
//   ];

//   if (
//     process.env.NODE_ENV !== "production" &&
//     process.env.REPL_ID !== undefined
//   ) {
//     );
//     plugins.push(cartographerPlugin);
//   }

//   return defineConfig({
//     plugins,
//     resolve: {
//       alias: {
//         "@": path.resolve(import.meta.dirname, "client", "src"),
//         "@shared": path.resolve(import.meta.dirname, "shared"),
//         "@assets": path.resolve(import.meta.dirname, "attached_assets"),
//       },
//     },
//     root: path.resolve(import.meta.dirname, "client"),
//     build: {
//       outDir: path.resolve(import.meta.dirname, "dist/public"),
//       emptyOutDir: true,
//     },
//   });
// }
