<script setup lang="ts">
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
const API_URL = `/api/pets/`;

export default {
  data() {
    return {
      image: [],
    };
  },
  components: { EditModal },
  methods: {
    async uploadImage() {
      const imageToUpload: File = this.image[0];
      const data = new FormData();
      data.append('petImage', imageToUpload, imageToUpload.name);

      // send fetch along with cookies
      const response = await fetch(`${API_URL}/${this._id}/addImage`, {
        method: 'POST',
        body: data,
      });

      // server responded with http response != 200
      if (response.status != 200) throw new Error('HTTP response code != 200');
    },
  },
};
</script>

<template>
  <v-container fluid>
    <v-card class="pa-3 ma-3">
      <v-card>
        <v-card class="pa-3 ma-3">
          <v-carousel hide-delimiters show-arrows="hover">
            <v-carousel-item src="https://cdn.vuetifyjs.com/images/cards/docks.jpg" cover></v-carousel-item>

            <v-carousel-item src="https://cdn.vuetifyjs.com/images/cards/hotel.jpg" cover></v-carousel-item>

            <v-carousel-item src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg" cover></v-carousel-item>
          </v-carousel>
        </v-card>
        <v-row class="pa-3 ma-3 d-flex">
          <v-col cols="11">
            <v-file-input v-model="image" name="pet-image" label="File input" clearable variant="solo"></v-file-input>
          </v-col>
          <v-col cols="1">
            <v-btn style="height: 60px; width: 66px" @click="uploadImage()">
              <v-icon>fa:fas fa-thin fa-arrow-up-from-arc</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
      <v-card class="elevation-7 pa-3 ma-3">
        <v-card-title class="d-flex justify-space-between">
          <span> Overview </span>
          <span>
            <edit-modal
              v-bind="{ _id, name, type, species, dateOfBirth, dateOfBirthFormatted, description }"
            ></edit-modal>
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
            <v-card-text class="overview-inline"> {{ dateOfBirthFormatted }} </v-card-text>
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
