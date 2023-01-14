<script setup lang="ts">
import RouterView from './router/RouterView.vue';
import AppBar from './components/AppBar.vue';
</script>

<template>
  <v-app>
    <AppBar />
    <RouterView />
  </v-app>
</template>
