import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// import dotenv from 'dotenv'


export default defineConfig (({mode})=>{
  const env = loadEnv(mode, process.cwd(), '');
  return{
    plugins: [tailwindcss()],
    define: {
      "process.env": env,
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5000', // Express backend
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
});