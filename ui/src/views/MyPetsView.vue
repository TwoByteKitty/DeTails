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
  <v-container fluid nogutters>
    <v-toolbar flat>
      <v-toolbar-title> My Pets </v-toolbar-title>
      <v-spacer></v-spacer>
      <div d-flex>
        <v-btn class="ma-2 pa-1" icon>
          <v-icon> fa:fas fa-thin fa-magnifying-glass </v-icon>
        </v-btn>
        <v-btn class="ma-2 pa-1" icon>
          <v-icon> fa:fas fa-thin fa-list </v-icon>
        </v-btn>
        <v-btn class="ma-2 pa-1" icon>
          <v-icon> fa:fas fa-thin fa-circle-sort </v-icon>
        </v-btn>
      </div>
    </v-toolbar>

    <v-list lines="two">
      <v-list-item v-for="{ name, _id, species } in myPets" :key="_id">
        <v-card class="ma-2">
          <v-row>
            <v-col>
              <v-img
                class="ma-2"
                aspect-ratio="1:1"
                lazy-src="https://picsum.photos/id/11/100/60"
                max-width="500"
                src="https://picsum.photos/id/11/100/60"
              >
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height"></div>
                </template>
              </v-img>
            </v-col>
            <v-col>
              <v-card-item>
                <v-card-title>{{ name }}</v-card-title>
                <v-card-subtitle>{{ species }}</v-card-subtitle>
              </v-card-item>
            </v-col>
            <v-spacer></v-spacer>
            <v-col class="d-flex justify-end align-center">
              <router-link :to="{ name: 'pet-details', params: { id: _id } }">
                <v-btn class="ma-2 pa-1" variant="flat" icon>
                  <v-icon> fa:fas fa-duotone fa-memo-circle-info</v-icon>
                </v-btn>
              </router-link>
            </v-col>
          </v-row>
        </v-card>
      </v-list-item>
    </v-list>
  </v-container>
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

<!-- <div class="mypets">
  <h1>This is my pets page</h1>
  <RouterLink to="/my-pets/add">Add a Pet</RouterLink>
  <ul>
    <li v-bind:key="_id" v-for="{ name, _id } in myPets">
      {{ name }}
    </li>
  </ul>
</div> -->
