<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>
<script lang="ts">
const API_URL = `/api/pets`;

export default {
  data: () => ({
    myPets: null,
  }),

  created() {
    // fetch on init
    this.fetchData();
  },

  watch: {},

  methods: {
    async fetchData() {
      const url = `${API_URL}`;
      this.myPets = await (await fetch(url)).json();
    },
  },
};
</script>

<template>
  <div class="mypets">
    <h1>This is my pets page</h1>
    <RouterLink to="/my-pets/add">Add a Pet</RouterLink>
    <ul>
      <li v-bind:key="_id" v-for="{ name, _id } in myPets">
        {{ name }}
      </li>
    </ul>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .my-pets {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
