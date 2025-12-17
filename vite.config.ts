import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@config': path.resolve(__dirname, './src/config'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/services'),
      '@projects': path.resolve(__dirname, './src/projects'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom'],
          // AI/Ingestion services (large, not always needed)
          'ai-services': [
            './src/services/geminiService.ts',
            './src/services/ingestion/aiProcessor.ts',
            './src/services/ingestion/arcTracker.ts',
          ],
          // Ingestion pipeline
          'ingestion': [
            './src/services/ingestion/pipeline.ts',
            './src/services/ingestion/parsers.ts',
          ],
        },
      },
    },
    // Increase warning limit slightly since we're code splitting
    chunkSizeWarningLimit: 400,
  },
});
