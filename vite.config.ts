/* eslint-disable import/no-extraneous-dependencies, import/no-default-export */
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname, './examples/src'),
  publicDir: path.resolve(__dirname, './examples/assets'),
  build: {
    outDir: path.join(__dirname, './examples/dist'),
    assetsDir: 'public',
  },
  resolve: {
    alias: {
      ponczek: path.resolve(__dirname, './src'),
      examples: path.resolve(__dirname, './examples/src'),
    },
  },
  server: {
    port: 1234,
  },
  preview: {
    port: 1234,
  },
});
