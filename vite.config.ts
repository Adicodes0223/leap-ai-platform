import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    // ✅ Required for correct static asset paths
    base: './',

    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },

    build: {
      // ✅ Optional: prevent large chunk warnings
      chunkSizeWarningLimit: 1500,
      // ✅ Fix blank screen on deploy for SPAs (especially with client-side routing)
      rollupOptions: {
        output: {
          manualChunks: undefined, // avoid aggressive chunk splitting
        },
      }
    },

    // ✅ Optional: Vercel/Netlify SPA fallback for 404s
    server: {
      fs: {
        allow: ['.'],
      }
    }
  };
});
