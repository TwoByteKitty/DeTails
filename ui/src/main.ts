import '@fortawesome/fontawesome-pro/css/all.css';
import '@mdi/font/css/materialdesignicons.css';
import '@vuepic/vue-datepicker/dist/main.css';
import 'v-calendar/dist/style.css';
import { fa } from 'vuetify/iconsets/fa';
import 'vuetify/styles';

import { createPinia } from 'pinia';
import SetupCalendar from 'v-calendar';
import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

import App from './App.vue';
import router from './router';
import './styles/main.css';

const app = createApp(App);
const vuetify = createVuetify({
  theme: {
    defaultTheme: 'dark',
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
// app.component('Datepicker', Datepicker);

app.use(createPinia());
app.use(SetupCalendar, {});
app.use(router);
app.use(vuetify);
app.mount('#app');
