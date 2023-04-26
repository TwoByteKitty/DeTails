<script lang="ts">
import { errorHandler } from "@/shared/errorHandler";
import type { IMeal } from "@/shared/interfaces/IMeal";
import type { IPetImage } from "@/shared/interfaces/IPetImage";
import type { IShed } from "@/shared/interfaces/IShed";
import type { IWeight } from "@/shared/interfaces/IWeight";
import { PET_API, POST_IMAGE } from "@/utils/fetch";
import EditOverviewModal from "../modals/EditOverviewModal.vue";
import EditPhotosModal from "../modals/EditPhotosModal.vue";
import type { PropType } from "vue";
import { DateTime } from 'luxon';

const defaultImgUpload = {
  image: [],
  imageTitle: '',
};
const errorMsg = 'You really screwed up this time...';
const successMsg = 'Image upload successful!';

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
        ...defaultImgUpload 
      },
      currentSlide: 0,
      alertType: 'success',
      alertIsError: false,
      alertMsg: successMsg,
      showAlert: false,
    };
  },
  computed: {
    age() {
      const today = DateTime.now();
      const birthday = DateTime.fromISO(this.dateOfBirth);
      const {years, months, days} = today.diff(birthday,  ['years', 'months', 'days']).toObject();
      return `${years} years, ${months} months`
    }
  },
  components: { EditOverviewModal, EditPhotosModal },
  methods: {
    uploadSuccess(){
      this.$emit('overviewEdited');
      this.alertMsg = successMsg;
      this.alertIsError = false;
      this.showAlert = true;
      this.imageUpload = { ...defaultImgUpload };
        setTimeout(() => {
          this.showAlert = false;
        }, 9000);
    },
    async uploadImage() {
      const imageToUpload: File = this.imageUpload.image[0];
      const data = new FormData();
      data.append("petImage", imageToUpload, imageToUpload.name);
      data.append("imageTitle", this.imageUpload.imageTitle);
      try{
        const response = await POST_IMAGE(`${PET_API}/${this._id}/add-image`, data)
        console.log(response);
        this.uploadSuccess();
      }catch(error){
        errorHandler(error, errorMsg, this);
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
            v-model="currentSlide"
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
              class="uploadBtn"
              variant="tonal"
              color="success"
              @click="uploadImage"
              elevation="9"
            >
              <v-icon>fa:fas fa-thin fa-arrow-up-from-arc</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div>
              <v-alert
                v-model="showAlert"
                :type="alertIsError ? 'error': 'success'"
                variant="tonal"
                closable
                close-label="Close Alert"
                >
                  {{
                    alertMsg
                  }}
              </v-alert>
            </div>
          </v-col>
        </v-row>
      </v-card>
      <v-card class="elevation-7 pa-3 ma-3">
        <v-card-title 
          class="d-flex justify-space-between"
          style="padding: 18px"
          >
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
              {{ age }}
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
.uploadBtn {
  height: 60px; 
  width: 66px;
  border: 1px solid rgba(32, 88, 34, 0.66);
}
.overview-inline {
  display: inline;
}
.pet-carousel .v-window__container > .v-window__controls {
  z-index: 2;
}
.album-edit-overlay {
  position: absolute;
  min-width: 100%;
  min-height: 100%;
  bottom: 5px;
  right: 5px;
  z-index: 0;
}

</style>
