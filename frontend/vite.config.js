import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('./ssl/private.key'),
      cert: fs.readFileSync('./ssl/certificate.crt'),
    },
    hmr: {
      protocol: 'wss',  // Use secure WebSocket
      host: '10.13.8.15',
      port: 5173,
    },
    port: 5173, // Optional: Specify your desired port
  },
});
