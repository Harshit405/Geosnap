import {defineConfig} from 'vite';import react from '@vitejs/plugin-react';import tailwind from '@tailwindcss/vite';import {viteSingleFile} from 'vite-plugin-singlefile';
export default defineConfig({plugins:[react(),tailwind(),viteSingleFile()],resolve:{alias:{'virtual:pwa-register':'/src/pwa-stub.ts'}},build:{outDir:'dist-single',chunkSizeWarningLimit:4000}});
