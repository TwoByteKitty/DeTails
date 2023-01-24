<script setup lang="ts">
import { RouterView } from 'vue-router';
import { routes } from './router';
//import RouterView from './router/RouterView.vue';
//import AppBar from './components/AppBar.vue';
</script>

<script lang="ts">
export default {
  data: () => ({
    pageTitle: 'DeTails',
    drawerVisibleLeft: false,
    drawerVisibleRight: false,
    routes,
    group: null,
    itemsRight: [
      {
        title: 'Account',
        value: 'foo',
      },
      {
        title: 'Settings',
        value: 'bar',
      },
      {
        title: 'Sign Off',
        value: 'fizz',
      },
    ],
  }),
  watch: {
    group() {
      this.drawerVisibleLeft = false;
      this.drawerVisibleRight = false;
    },
  },
};
</script>

<template>
  <v-app>
    <v-app-bar color="primary" prominent>
      <v-app-bar-nav-icon
        icon="fa:fas fa-duotone fa-bars"
        variant="text"
        @click.stop="drawerVisibleLeft = !drawerVisibleLeft"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon
        icon="fa:fas fa-duotone fa-ellipsis-vertical"
        variant="text"
        @click.stop="drawerVisibleRight = !drawerVisibleRight"
      ></v-app-bar-nav-icon>
    </v-app-bar>
    <v-navigation-drawer v-model="drawerVisibleLeft" location="left" temporary>
      <v-list>
        <v-list-item v-for="route in routes" :key="route.pageTitle">
          <router-link :to="route.path">{{ route.pageTitle }}</router-link>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer v-model="drawerVisibleRight" location="right" width="150" color="grey-lighten-1" temporary>
      <v-list :items="itemsRight"></v-list
    ></v-navigation-drawer>
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>
