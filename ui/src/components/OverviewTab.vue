<script setup lang="ts">
import { RouterLink } from 'vue-router';
import EditModal from './EditModal.vue';
export interface EditPetProps {
  _id: string;
  name: string;
  type: string;
  species: string;
  dateOfBirth: string;
  dateOfBirthFormatted: string;
  description: string;
}
defineProps<EditPetProps>();
</script>

<script lang="ts">
export default {
  components: { EditModal },
};
</script>

<template>
  <v-container fluid>
    <v-card class="pa-3 ma-3">
      <v-card class="pa-3 ma-3">
        <v-carousel hide-delimiters show-arrows="hover">
          <v-carousel-item src="https://cdn.vuetifyjs.com/images/cards/docks.jpg" cover></v-carousel-item>

          <v-carousel-item src="https://cdn.vuetifyjs.com/images/cards/hotel.jpg" cover></v-carousel-item>

          <v-carousel-item src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg" cover></v-carousel-item>
        </v-carousel>
      </v-card>
      <div class="pa-3 ma-3">
        <v-file-input label="File input" clearable variant="solo"></v-file-input>
      </div>
      <v-card class="elevation-7 pa-3 ma-3">
        <v-card-title class="d-flex justify-space-between">
          <span> Overview </span>
          <span>
            <edit-modal v-bind="{ _id, name, type, species, dateOfBirthFormatted, description }"></edit-modal>
          </span>
        </v-card-title>
        <v-row>
          <v-col>
            <v-card-subtitle class="overview-inline">Type:</v-card-subtitle>
            <v-card-text class="overview-inline"> {{ type }} </v-card-text>
          </v-col>
          <v-col>
            <v-card-subtitle class="overview-inline">Weight:</v-card-subtitle>
            <v-card-text class="overview-inline"> {{ type }} </v-card-text>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card-subtitle class="overview-inline">Species:</v-card-subtitle>
            <v-card-text class="overview-inline"> {{ species }} </v-card-text>
          </v-col>
          <v-col>
            <v-card-subtitle class="overview-inline">Last Meal:</v-card-subtitle>
            <v-card-text class="overview-inline"> {{ type }} </v-card-text>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card-subtitle class="overview-inline">Age:</v-card-subtitle>
            <v-card-text class="overview-inline"> {{ dateOfBirth }} </v-card-text>
          </v-col>
          <v-col>
            <v-card-subtitle class="overview-inline">Last Shed:</v-card-subtitle>
            <v-card-text class="overview-inline"> {{ type }} </v-card-text>
          </v-col>
        </v-row>
        <v-row class="pb-3">
          <v-col>
            <v-card-subtitle>Description:</v-card-subtitle>
            <v-card-text> {{ description }} </v-card-text>
          </v-col>
        </v-row>
      </v-card>
    </v-card>
  </v-container>
</template>

<style lang="css" scoped>
.overview-inline {
  display: inline;
}
</style>
