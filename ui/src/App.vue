<script lang="ts">
import { useAuthStore } from '@/stores/auth.store';
import {
BarElement, CategoryScale, Chart as ChartJS, LinearScale, LineElement,
PointElement,
TimeScale, Tooltip
} from 'chart.js';
import 'chartjs-adapter-luxon';
import { RouterView } from 'vue-router';
import { routes } from './router';
import type { IRoute } from './shared/interfaces/IRoute';
//import RouterView from './router/RouterView.vue';
//import AppBar from './components/AppBar.vue';

ChartJS.register(BarElement, LineElement, PointElement, TimeScale, LinearScale, CategoryScale, Tooltip);

export default {
  components:{ RouterView },
  data: () => ({
 //   pageTitle: 'DeTails',
    drawerVisibleLeft: false,
    drawerVisibleRight: false,
    routes,
    group: null,
    itemsRight: [
      {
        title: 'Account',
        type:'link',
        url: '/foo',
        action: ()=>{},
      },
      {
        title: 'Settings',
        type:'link',
        url:'/bar',
        action: ()=>{},
      },
      {
        title: 'Sign Off',
        type: 'action',
        url:'',
        action: ()=> useAuthStore().logout(false),
      },
    ],
  }),
  watch: {
    group() {
      this.drawerVisibleLeft = false;
      this.drawerVisibleRight = false;
    },
  },
  computed:{
    navMenu(){
      const { user } = useAuthStore();
      const filteredRoutes = routes.filter((route)=>{return route.meta.showInMenu});
      let authRoutes: Array<IRoute>;
      if (user) {
        authRoutes = filteredRoutes.filter((route)=>{return route.meta.authRequired});
      } else {
        authRoutes = filteredRoutes.filter((route)=>{return !route.meta.authRequired});
      }
      return authRoutes;
    }
  }
};
</script>

<template>
  <v-app>
    <v-app-bar
      class="py-2"
      color="var(--md-ref-palette-neutral-variant20)"
    >
      <v-app-bar-nav-icon
        icon="fa:fas fa-duotone fa-bars"
        variant="text"
        @click.stop="$event => drawerVisibleLeft = !drawerVisibleLeft"
      />
      <v-spacer />
      <v-img
        src="/assets/logo-no-background.svg"
      />
      <v-spacer />
      <v-app-bar-nav-icon
        icon="fa:fas fa-duotone fa-ellipsis-vertical"
        variant="text"
        @click.stop="$event => drawerVisibleRight = !drawerVisibleRight"
      />
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawerVisibleLeft"
      location="left"
      temporary
      width="300"
    >
      <v-list
        class="mt-3"
      >
        <v-list-item
          v-for="route in navMenu"
          :key="route.pageTitle"
          class="ma-2 pt-6 px-4 display-medium"
        >
          <router-link
            :to="route.path"
            style="text-decoration: none; padding-left: 6px;"
          >
            {{ route.pageTitle }}
          </router-link>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer
      v-model="drawerVisibleRight"
      location="right"
      width="210"
      temporary
    >
      <v-list-item
        v-for="item in itemsRight"
        :key="item.title"
        class="ma-2 pt-6 px-4 display-medium"
      >
        <!-- Other -->
        <a
          v-if="item.type === 'link'"
          :href="item.url"
          style="text-decoration: none; padding-left: 6px;"
        >{{ item.title }}</a>
        <!-- Logout -->
        <a
          v-if="item.type === 'action'"
          href="#"
          style="text-decoration: none; padding-left: 6px;"
          @click.prevent="$event => item.action()"
        >{{ item.title }}</a>
      </v-list-item>
    </v-navigation-drawer>
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>
