<script lang="ts">
import { useAuthStore } from '@/stores/auth.store';
import { DELETE, PET_API, PUT } from '@/utils/fetch';
import { DateTime } from 'luxon';

const DATE_FORMAT_STRING = 'yyyy-MM-dd';
const errorMsg = 'Well... you really screwed up this time...';
const successMsg = "I'm a success alert! Congratulations!";


export default {
  name: 'EditPhotosModal',
  components:{ },
  emits: [ 'photosEdited' ],
  props: {
      // eslint-disable-next-line vue/prop-name-casing
      _id: { type: String, required: true },
      uploadDate: { type: String, required: true },
      imageTitle: { type: String, required: true },
      imagePath: { type: String, required: true },
      isThumbnail: { type: Boolean, required: true },
  },
  data() {
    return {
      deleteImage: false,
      modalIsOpen: false,
      alertType: 'success',
      alertIsError: false,
      alertMsg: successMsg,
      showAlert: false,
      fields: {
        _id: this.id,
        imageTitle: this.imageTitle,
        isThumbnail: this.isThumbnail,

      },
    };
  },
  watch: {
    _id: {
      immediate: true,
      handler(newVal) {
        this.fields._id = newVal;
      },
    },
    imageTitle: {
      immediate: true,
      handler(newVal) {
        this.fields.imageTitle = newVal;
      },
    },
    isThumbnail: {
      immediate: true,
      handler(newVal) {
        this.fields.isThumbnail = newVal;
      },
    },
  },
  methods: {
    editSuccess(data: any){
      console.log(data);
      this.$emit('photosEdited');
      this.alertMsg = successMsg;
      this.alertIsError = false;
      this.showAlert = true;
      setTimeout(() => {
        this.showAlert = false;
        this.modalIsOpen = false;
      }, 1000);
    },
    editError(error: any){
      const { logout } = useAuthStore();
      if(error.message.split()[0] === 'AUTH'){
         logout()
      }else{
      this.alertMsg = errorMsg;
      this.alertIsError = true;
      this.showAlert = true;
      }
    },
    async editPhoto() {
      let data = null;
      try{
        if(this.deleteImage){
            data = await DELETE(`${PET_API}/${this.$route.query.id}/delete-image`, { ...this.fields, imagePath: this.imagePath });
        }else{
            data = await PUT(`${PET_API}/${this.$route.query.id}/edit-image`, this.fields);
        }
         this.editSuccess(data);
      }catch(error){
         this.editError(error)
      }
    },
    formatDate(timestamp: string) {
      return DateTime.fromISO(timestamp).toFormat(DATE_FORMAT_STRING);
    },
  },
};
</script>

<template>
  <v-row justify="center">
    <v-dialog
      v-model="modalIsOpen"
      persistent
    >
      <template #activator="{ props }">
        <v-btn
          class="album-edit-button"
          v-bind="props"
        >
          <v-icon>fa:fas fa-thin fa-pen-to-square</v-icon>
        </v-btn>
      </template>
      <v-card
        title="Edit Current Slide"
        class="pa-3 ma-3"
      >
        <div
          style="margin: auto; width: 480px; height: 480px;"
        >
          <v-img
            style="margin: auto;"
            :src="imagePath"
          />
        </div>
        <v-card
          class="ma-3 px-6 py-3 elevation-3"
        >
          <v-row class="ma-3 pa-3">
            <v-col
              cols="9"
            >
              <v-text-field
                v-model="fields.imageTitle"
                label="Image Title"
              />
            </v-col>
            <v-col
              cols="12"
            >
              <v-checkbox
                v-model="fields.isThumbnail"
                label="Use this image as the pet's thumbnail?"
              />
            </v-col>
            <v-col>
              <v-divider
                :thickness="6"
                color="error"
              />
            </v-col>
            <v-col
              cols="12"
              style="display: grid;"
            >
              <v-spacer />
              <v-checkbox
                v-model="deleteImage"
                class="delete-chkbx"
                label="Do you want to DELETE this image?"
                color="error"
                :hide-details="true"
              />
              <v-spacer />
            </v-col>
            <v-col>
              <v-divider
                :thickness="6"
                color="error"
              />
            </v-col>
          </v-row>
        </v-card>
        <v-card-actions>
          <v-spacer />
          <div class="ml-2 pl-2 mr-2 pr-2">
            <v-btn
              color="error"
              variant="text"
              prepend-icon="fa:fas fa-thin fa-xmark"
              @click="($event: any) => modalIsOpen = false"
            >
              Close
            </v-btn>
          </div>
          <div class="ml-2 pl-2 mr-2 pr-2">
            <v-btn
              color="success"
              variant="text"
              prepend-icon="fa:fas fa-thin fa-check"
              @click="editPhoto"
            >
              Save
            </v-btn>
          </div>
        </v-card-actions>
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
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style lang="css">
.album-edit-button {
  height: 60px;
  width: 66px;
  position: absolute;
  bottom: 0;
  right: 0;
  opacity: 80%;
  z-index: 5;
}
.delete-chkbx {
  color: var(--md-ref-palette-error60);
  padding: 15px;
  justify-self: center;
}
.delete-chkbx .v-label  {
  font-size: 1.25rem;
}

</style>
