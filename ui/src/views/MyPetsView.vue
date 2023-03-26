<script lang="ts">
import type { IPetImage } from '@/shared/interfaces/IPetImage';
import { useAuthStore } from '@/stores/auth.store';
import { PET_API, POST } from '@/utils/fetch';
import { RouterLink } from 'vue-router';

interface IImgMap{
  [key:string]: string;
}

const defaultImgMap: IImgMap = {
  amphibian: 'https://pic-bkt-1.nyc3.cdn.digitaloceanspaces.com/pet-clipart%2Ffrog1.jfif',
  bird: 'https://pic-bkt-1.nyc3.cdn.digitaloceanspaces.com/pet-clipart%2Fbird1.jfif',
  cat: 'https://pic-bkt-1.nyc3.cdn.digitaloceanspaces.com/pet-clipart%2Fcat1.jfif',
  dog: 'https://pic-bkt-1.nyc3.cdn.digitaloceanspaces.com/pet-clipart%2Fdog1.jfif',
  fish: 'https://pic-bkt-1.nyc3.cdn.digitaloceanspaces.com/pet-clipart%2Ffish1.jfif',
  lizard: 'https://pic-bkt-1.nyc3.cdn.digitaloceanspaces.com/pet-clipart%2Flizard5.jpg',
  snake: 'https://pic-bkt-1.nyc3.cdn.digitaloceanspaces.com/pet-clipart%2FsnekBW2.jfif'
}

export default {
  components: { RouterLink },
  data: () => ({
    myPets: null,
    defaultImgMap
  }),

  created() {
    // fetch on init
    this.fetchData();
  },

  watch: {},

  methods: {
    async fetchData() {
      const { logout, user: {userName, token} } = useAuthStore();
      try{
         this.myPets = await POST(PET_API, { userName }, token);
      }catch(error: any){
         if(error.message.split(':')[0] === 'AUTH'){
            logout()
         }
      }
    },
    // add another param to this function for petImages
    getThumbnail(type: string, petImages: [IPetImage]) {
      let thumbnail: string;
      const petImgThumb = petImages.find(({isThumbnail}) => isThumbnail === true);
      if (petImgThumb) {
        thumbnail = petImgThumb.imagePath
      } else {
        thumbnail = this.defaultImgMap[type]
      }
      return thumbnail;
    }
  },
};
</script>

<template>
  <v-container
    fluid
    nogutters
  >
    <v-toolbar flat>
      <v-toolbar-title> My Pets </v-toolbar-title>
      <v-spacer />
      <div d-flex>
        <v-btn
          class="ma-2 pa-1"
          icon
        >
          <v-icon> fa:fas fa-thin fa-magnifying-glass </v-icon>
        </v-btn>
        <v-btn
          class="ma-2 pa-1"
          icon
        >
          <v-icon> fa:fas fa-thin fa-list </v-icon>
        </v-btn>
        <v-btn
          class="ma-2 pa-1"
          icon
        >
          <v-icon> fa:fas fa-thin fa-circle-sort </v-icon>
        </v-btn>
      </div>
    </v-toolbar>

    <v-list lines="two">
      <v-list-item
        v-for="{ name, _id, species, type, petImages } in myPets"
        :key="_id"
      >
        <v-card class="ma-2">
          <v-row>
            <v-col>
              <router-link :to="{ name: 'pet-details', query: { id: _id } }">
                <v-img
                  class="ma-2"
                  aspect-ratio="1:1"
                  max-width="500"
                  :src="getThumbnail(type, petImages)"
                />
              </router-link>
            </v-col>
            <v-col>
              <v-card-item>
                <v-card-title>{{ name }}</v-card-title>
                <v-card-subtitle>{{ type }}</v-card-subtitle>
                <v-card-subtitle>{{ species }}</v-card-subtitle>
              </v-card-item>
            </v-col>
            <v-spacer />
            <v-col class="d-flex justify-end align-center">
              <router-link :to="{ name: 'pet-details', query: { id: _id } }">
                <v-btn
                  class="ma-2 pa-1"
                  variant="flat"
                  icon
                >
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
