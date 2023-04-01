<script lang="ts">
import {
BarElement, CategoryScale, Chart as ChartJS, LinearScale, LineElement,
PointElement,
TimeScale, Tooltip
} from 'chart.js';
import 'chartjs-adapter-luxon';
import { RouterView } from 'vue-router';
import { routes } from './router';
import { useAuthStore } from '@/stores/auth.store';
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
        action: ()=> useAuthStore().logout(),
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
      return routes.filter((route)=>{return route.meta.showInMenu})
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
      width="150"
      color="grey-lighten-1"
      temporary
    >
      <v-list-item
        v-for="item in itemsRight"
        :key="item.title"
      >
        <!-- Other -->
        <a
          v-if="item.type === 'link'"
          :href="item.url"
        >{{ item.title }}</a>
        <!-- Logout -->
        <a
          v-if="item.type === 'action'"
          @click.prevent="$event => item.action()"
        >{{ item.title }}</a>
      </v-list-item>
    </v-navigation-drawer>
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>
