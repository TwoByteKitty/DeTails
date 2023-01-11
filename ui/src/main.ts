import { aliases, fa } from 'vuetify/iconsets/fa';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify';
import { mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import App from './App.vue';
import router from './router';

import '@fortawesome/fontawesome-free/css/all.css';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import './assets/main.css';

const app = createApp(App);
const vuetify = createVuetify({
  theme: { dark: true },
  components,
  directives,
  icons: {
    defaultSet: 'fa',
    aliases,
    sets: {
      fa,
      mdi,
    },
  },
});

app.use(createPinia());
app.use(router);
app.use(vuetify);
app.mount('#app');
