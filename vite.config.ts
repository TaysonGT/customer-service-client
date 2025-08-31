import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig (({mode})=>{
  const env = loadEnv(mode, process.cwd(), '')
  return{
    plugins: [tailwindcss()],
    // define: {
    //   "process.env": env,
    // },
    server: {
      proxy: {
        '/api': {
          target: env.NODE_ENV === 'production'? env.VITE_BACKEND_URL: 'http://localhost:5000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
});