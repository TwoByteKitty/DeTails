import '@fortawesome/fontawesome-free/css/all.css';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import './styles/main.css';

import { fa } from 'vuetify/iconsets/fa';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import App from './App.vue';
import router from './router';
import lightTheme from './styles/themes/light';
import darkTheme from './styles/themes/dark';

const app = createApp(App);
const vuetify = createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      lightTheme,
      darkTheme,
    },
  },
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
      fa,
    },
  },
});

app.use(createPinia());
app.use(router);
app.use(vuetify);
app.mount('#app');
