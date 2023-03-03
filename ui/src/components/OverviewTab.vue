<script lang="ts">
import EditModal from "./EditModal.vue";

const API_URL = `/api/pets/`;

export default {
  name: "OverviewTab",
  props: {
    // eslint-disable-next-line vue/prop-name-casing
    _id: { type: String, required: true, default:'' },
    name: String,
    type: String,
    species: String,
    dateOfBirth: String,
    description: String,
    petImages: Array<String>,
  },
  data() {
    return {
      image: undefined,
    };
  },
  components: { EditModal },
  methods: {
    async uploadImage() {
      const imageToUpload: File = this.image[0];
      const data = new FormData();
      data.append("petImage", imageToUpload, imageToUpload.name);

      // send fetch along with cookies
      const response = await fetch(`${API_URL}/${this._id}/addImage`, {
        method: "POST",
        body: data,
      });

      // server responded with http response != 200
      if (response.status != 200) throw new Error("HTTP response code != 200");
    },
  },
};
</script>

<template>
  <v-container fluid>
    <v-card class="pa-3 ma-3">
      <v-card>
        <v-card class="pa-1 ma-3 elevation-5 pet-carousel">
          <v-carousel
            hide-delimiters
            show-arrows="hover"
            :model-value="0"
          >
            <v-carousel-item
              v-for="(image, index) in petImages"
              :key="index"
              :src="`/images/${image}`"
              contain
            />
          </v-carousel>
          <div class="album-edit-overlay">
            <v-btn class="album-edit-button">
              <v-icon>fa:fas fa-thin fa-pen-to-square</v-icon>
            </v-btn>
          </div>
        </v-card>
        <v-row class="pa-3 ma-3 d-flex">
          <v-col cols="9">
            <v-file-input
              v-model="image"
              name="pet-image"
              label="Upload photos"
              clearable
              variant="solo"
            />
          </v-col>
          <v-col>
            <v-text-field label="Title" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="9" />
          <v-col />
          <v-col cols="1">
            <v-btn
              style="height: 60px; width: 66px"
              @click="uploadImage()"
            >
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
              v-bind="{ _id, name, type, species, dateOfBirth, description }"
            />
          </span>
        </v-card-title>
        <v-row>
          <v-col>
            <v-card-subtitle class="overview-inline">
              Type:
            </v-card-subtitle>
            <v-card-text class="overview-inline">
              {{ type }}
            </v-card-text>
          </v-col>
          <v-col>
            <v-card-subtitle class="overview-inline">
              Weight:
            </v-card-subtitle>
            <v-card-text class="overview-inline">
              {{ type }}
            </v-card-text>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card-subtitle class="overview-inline">
              Species:
            </v-card-subtitle>
            <v-card-text class="overview-inline">
              {{ species }}
            </v-card-text>
          </v-col>
          <v-col>
            <v-card-subtitle class="overview-inline">
              Last Meal:
            </v-card-subtitle>
            <v-card-text class="overview-inline">
              {{ type }}
            </v-card-text>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card-subtitle class="overview-inline">
              Age:
            </v-card-subtitle>
            <v-card-text class="overview-inline">
              {{ dateOfBirth }}
            </v-card-text>
          </v-col>
          <v-col>
            <v-card-subtitle class="overview-inline">
              Last Shed:
            </v-card-subtitle>
            <v-card-text class="overview-inline">
              {{ type }}
            </v-card-text>
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
.pet-carousel .v-window__container > .v-window__controls {
  z-index: 2;
}
.album-edit-overlay {
  position: absolute;
  min-width: 100%;
  min-height: 20%;
  bottom: 0;
  z-index: 0;
}

.album-edit-button {
  height: 60px;
  width: 66px;
  position: absolute;
  bottom: 0;
  right: 0;
  opacity: 80%;
  z-index: 5;
}
</style>
