import '@fortawesome/fontawesome-pro/css/all.css';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import 'v-calendar/dist/style.css';
import '@vuepic/vue-datepicker/dist/main.css';
import { fa } from 'vuetify/iconsets/fa';

import SetupCalendar from 'v-calendar';
import Datepicker from '@vuepic/vue-datepicker';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import App from './App.vue';
import router from './router';
// import lightTheme from './styles/themes/light';
// import darkTheme from './styles/themes/dark';
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
