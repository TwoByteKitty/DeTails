<script lang="ts">
import type { IPetImage } from '@/shared/interfaces/IPetImage';
import { useAuthStore, USER_KEY } from '@/stores/auth.store';
import { PET_API, POST } from '@/utils/fetch';
import { RouterLink } from 'vue-router';
import { useCookies } from 'vue3-cookies';

interface IImgMap {
  [key: string]: string;
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
      const { logout } = useAuthStore();
      const { cookies } = useCookies();
      try {
        this.myPets = await POST(PET_API, { userName: cookies.get(USER_KEY) });
      } catch (error: any) {
        if (error.message.split(':')[0] === 'AUTH') {
          logout()
        }
      }
    },
    // add another param to this function for petImages
    getThumbnail(type: string, petImages: [IPetImage]) {
      let thumbnail: string;
      const petImgThumb = petImages && petImages.find(({ isThumbnail }) => isThumbnail === true);
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
  <v-sheet
    class="pa-1 ma-0"
    style="display: grid;"
  >
    <span
      class="mx-auto mt-6"
      style="font-size: 0.9rem;"
    >
      List looking a little empty? Bring home a new buddy?
    </span>
    <router-link
      to="/my-pets/add"
      style="display: grid; text-decoration: none;"
    >
      <v-btn
        class="add-pet-btn mx-auto my-3"
        x-large
        variant="tonal"
      >
        Add a New Pet
      </v-btn>
    </router-link>
    <v-card 
      class="pa-0 ma-1 ma-md-3 ma-lg-9 mx-xl-auto xl-width"
      elevation="9"
    >
      <v-toolbar
        class="mb-1"
        elevation="3"
      >
        <v-toolbar-title class="title-large">
          My Pets
        </v-toolbar-title>
        <v-spacer />
      </v-toolbar>

      <v-list lines="one">
        <v-list-item
          v-for="{ name, _id, species, type, petImages } in myPets"
          :key="_id"
          class="ma-1 pa-1 px-lg-6 py-lg-3"
          rounded
          elevation="0"
        >
          <v-card
            class="ma-1 mx-lg-9 pa-1 pa-lg-3"
            elevation="9"
            min-height="300"
          >
            <v-row class="pet-row">
              <v-col
                class="pet-img"
                cols="12"
                md="4"
              >
                <router-link :to="{ name: 'pet-details', query: { id: _id } }">
                  <v-img
                    class="ma-1 mx-lg-3"
                    aspect-ratio="1:1"
                    max-height="300"
                    :src="getThumbnail(type, petImages)"
                  />
                </router-link>
              </v-col>
              <v-divider
                :thickness="3"
                vertical
              />
              <v-col 
                class="pet-info"
              >
                <v-card-item class="my-0 my-lg-3 mx-6 py-1 py-lg-3 px-1">
                  <v-card-title>{{ name }}</v-card-title>
                  <v-card-subtitle>{{ type }}</v-card-subtitle>
                  <v-card-subtitle>{{ species }}</v-card-subtitle>
                </v-card-item>
                <v-spacer />
              </v-col>
            </v-row>
          </v-card>
        </v-list-item>
      </v-list>
    </v-card>
  </v-sheet>
</template>

<style>
@media (min-width: 1024px) {
  .my-pets {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}

.add-pet-btn {
  color: var(--md-ref-palette-primary30);
  width: inherit;
  box-shadow: 1px 1px 6px 3px rgba(3, 0, 6, 0.18);
  border: 1px solid var(--md-ref-palette-primary30);
}

@media (min-width: 1024px) {
  .add-pet-btn {
    width: 33%;
  }
}
.pet-row{
  min-height: inherit;
}
.pet-row > .pet-img{
  display: flex;
}
.pet-row > .pet-img a{
  display: contents;
}
.pet-row > .pet-info{
  display: grid;
}
@media (min-width: 960px){
.pet-row > .pet-info{
  display: flex;
}
}
.pet-info > .v-card-item {
  justify-self: center;
}
</style>
