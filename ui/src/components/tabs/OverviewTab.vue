<script lang="ts">
import type { IMeal } from "@/shared/interfaces/IMeal";
import type { IPetImage } from "@/shared/interfaces/IPetImage";
import type { IShed } from "@/shared/interfaces/IShed";
import type { IWeight } from "@/shared/interfaces/IWeight";
import { useAuthStore } from "@/stores/auth.store";
import { PET_API, POST_IMAGE } from "@/utils/fetch";
import type { PropType } from "vue";
import EditOverviewModal from "../modals/EditOverviewModal.vue";
import EditPhotosModal from "../modals/EditPhotosModal.vue";

const defaultImgUpload = {
   image: [],
   imageTitle: '',
};


export default {
  name: "OverviewTab",
  emits: [ 'overviewEdited' ],
  props: {
    // eslint-disable-next-line vue/prop-name-casing
    _id: { type: String, required: true, default: '' },
    name: { type: String, required: true, default: '' },
    type: { type: String, required: true, default: '' },
    species: { type: String, required: true, default: '' },
    sex: { type: String, required: true, default: '' },
    dateOfBirth: { type: String, required: true, default: '' },
    description: { type: String, required: false, default: '' },
    petImages: { type: Array as PropType<Array<IPetImage>>, required: false, default: new Array<IPetImage>() },
    shedHistory: { type: Array as PropType<Array<IShed>>, required: true },
    feedingHistory: { type: Array as PropType<Array<IMeal>>, required: true },
    weightHistory: { type: Array as PropType<Array<IWeight>>, required: true },
    },
  data() {
    return {
      imageUpload: {
        ...defaultImgUpload },
    };
  },
  components: { EditOverviewModal, EditPhotosModal },
  methods: {
    async uploadImage() {
      const imageToUpload: File = this.imageUpload.image[0];
      const data = new FormData();
      data.append("petImage", imageToUpload, imageToUpload.name);
      data.append("imageTitle", this.imageUpload.imageTitle);
      try{
         const response = await POST_IMAGE(`${PET_API}/${this._id}/add-image`, data, useAuthStore().user.token)
         this.$emit("overviewEdited");
         this.imageUpload = { ...defaultImgUpload };
         console.log(response);
      }catch(error){
         console.log(error);
      }
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
              v-for="(currentImg, index) in petImages"
              :key="index"
              :src="`${currentImg.imagePath}`"
              contain
            >
              <div class="album-edit-overlay">
                <edit-photos-modal
                  :_id="currentImg._id"
                  :image-title="currentImg.imageTitle"
                  :is-thumbnail="currentImg.isThumbnail"
                  :upload-date="currentImg.uploadDate"
                  :image-path="currentImg.imagePath"
                  @photos-edited="$event => $emit('overviewEdited')"
                />
              </div>
            </v-carousel-item>
          </v-carousel>
        </v-card>
        <v-row class="pa-3 ma-3 d-flex">
          <v-col cols="6">
            <v-file-input
              v-model="imageUpload.image"
              name="pet-image"
              label="Upload photos"
              clearable
              variant="solo"
            />
          </v-col>
          <v-col>
            <v-text-field
              v-model="imageUpload.imageTitle"
              label="Title"
            />
          </v-col>
          <v-col cols="1">
            <v-btn
              style="height: 60px; width: 66px"
              @click="uploadImage"
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
            <edit-overview-modal
              v-bind="{ _id, name, sex, species, dateOfBirth, description }"
              @overview-edited="$event => $emit('overviewEdited')"
            />
          </span>
        </v-card-title>
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
              Weight:
            </v-card-subtitle>
            <v-card-text class="overview-inline">
              {{ weightHistory.length? `${weightHistory[weightHistory.length - 1].weighAmt} ${weightHistory[0].weighUnits}` : 'No Record' }}
            </v-card-text>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card-subtitle class="overview-inline">
              Sex:
            </v-card-subtitle>
            <v-card-text class="overview-inline">
              {{ sex }}
            </v-card-text>
          </v-col>
          <v-col>
            <v-card-subtitle class="overview-inline">
              Last Meal:
            </v-card-subtitle>
            <v-card-text class="overview-inline">
              {{ feedingHistory.length? feedingHistory[feedingHistory.length - 1].feedDate : 'No Record' }}
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
              {{ shedHistory.length? shedHistory[shedHistory.length - 1].shedSkin : 'No Record' }}
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
