<script setup lang="ts">
import { RouterView } from 'vue-router';
//import RouterView from './router/RouterView.vue';
//import AppBar from './components/AppBar.vue';
</script>

<script lang="ts">
export default {
  data: () => ({
    pageTitle: 'DeTails',
    drawerVisible: false,
    group: null,
    items: [
      {
        title: 'Foo',
        value: 'foo',
      },
      {
        title: 'Bar',
        value: 'bar',
      },
      {
        title: 'Fizz',
        value: 'fizz',
      },
      {
        title: 'Buzz',
        value: 'buzz',
      },
    ],
  }),
  watch: {
    group() {
      this.drawerVisible = false;
    },
  },
};
</script>

<template>
  <v-app>
    <v-app-bar color="primary" prominent>
      <v-app-bar-nav-icon variant="text" @click.stop="drawerVisible = !drawerVisible"></v-app-bar-nav-icon>

      <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn variant="text" icon="mdi-magnify"></v-btn>
      <v-btn variant="text" icon="mdi-filter"></v-btn>
      <v-btn variant="text" icon="mdi-dots-vertical"></v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="drawerVisible" location="left" temporary>
      <v-list :items="items"></v-list>
    </v-navigation-drawer>
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>
