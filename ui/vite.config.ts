import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

import { defineConfig, type ConfigEnv, type UserConfig } from 'vite';

const baseConfig = {
   base: './',
   plugins: [vue(), vuetify({ styles: { configFile: 'src/styles/settings.scss' } })],
   resolve: {
      alias: {
         '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
   },
};

const serveConfig: UserConfig = {
   ...baseConfig,
   define: {
      API_HOST: JSON.stringify('http://localhost:3001'),
   },
};

const buildConfig: UserConfig = {
   ...baseConfig,
   define: {
      API_HOST: JSON.stringify('https://jellyfish-app-yclr8.ondigitalocean.app'),
   }
};

// https://vitejs.dev/config/
export default defineConfig(({ command }: ConfigEnv) => {
   if (command === 'serve') {
      return serveConfig;
   } else {
      // command === 'build'
      return buildConfig;
   }
});
