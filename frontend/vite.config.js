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
    port: 5173, // Optional: Specify your desired port
  },
});
