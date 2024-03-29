import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';
import codegen from 'vite-plugin-graphql-codegen';
import topLevelAwait from 'vite-plugin-top-level-await';
import dynamicImport from 'vite-plugin-dynamic-import';

export default defineConfig({
  server: {
    port: 4000,
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `chunks/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
  plugins: [
    ...VitePluginNode({
      adapter: 'express',
      appPath: './src/main.ts',
      tsCompiler: 'swc',
    }),
    codegen({
      matchOnSchemas: true,
      debug: true,
    }),
    topLevelAwait({
      promiseExportName: '__tla',
      promiseImportName: i => `__tla_${i}`,
    }),
    dynamicImport(),
  ],
});
