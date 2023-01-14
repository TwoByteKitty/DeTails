<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<script lang="ts">
export default {};
</script>

<template>
  <v-navigation-drawer v-model="drawer" location="bottom" temporary>
    <v-list :items="items"></v-list>
  </v-navigation-drawer>
</template>

<style scoped></style>
