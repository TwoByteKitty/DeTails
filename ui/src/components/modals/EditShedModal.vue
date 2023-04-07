<script lang="ts">
import { TOKEN_KEY, useAuthStore } from '@/stores/auth.store';
import { PET_API, PUT } from '@/utils/fetch';
import { DateTime } from 'luxon';
import { useCookies } from 'vue3-cookies';

const DATE_FORMAT_STRING = 'yyyy-MM-dd';
const errorMsg = 'Well... you really screwed up this time...';
const successMsg = "I'm a success alert! Congratulations!";


export default {
  name: 'EditShedModal',
  components:{ },
  emits: [ 'shedEdited' ],
  props: {
      // eslint-disable-next-line vue/prop-name-casing
      _id: { type: String, required: true },
      pinkBelly: { type: String, required: true },
      blueEyes: { type: String, required: true },
      clearEyes: { type: String, required: true },
      shedSkin: { type: String, required: true },
      entire: { type: String, required: true },
      shedComments: { type: String, required: true },
  },
  data() {
    return {
      modalIsOpen: false,
      alertType: 'success',
      alertIsError: false,
      alertMsg: successMsg,
      showAlert: false,
      fields: {
        _id: this.id,
        pinkBelly: this.pinkBelly,
        blueEyes: this.blueEyes,
        clearEyes: this.clearEyes,
        shedSkin: this.shedSkin,
        entire: this.entire,
        shedComments: this.shedComments,
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
    pinkBelly: {
      immediate: true,
      handler(newVal) {
        this.fields.pinkBelly = newVal;
      },
    },
    blueEyes: {
      immediate: true,
      handler(newVal) {
        this.fields.blueEyes = newVal;
      },
    },
    clearEyes: {
      immediate: true,
      handler(newVal) {
        this.fields.clearEyes = newVal;
      },
    },
    shedSkin: {
      immediate: true,
      handler(newVal) {
        this.fields.shedSkin = newVal;
      },
    },
    entire: {
      immediate: true,
      handler(newVal) {
        this.fields.entire = newVal;
      },
    },
    shedComments: {
      immediate: true,
      handler(newVal) {
        this.fields.shedComments = newVal;
      },
    },
  },
  methods: {
    editSuccess(data: any){
      console.log(data);
      this.$emit('shedEdited');
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
      console.error(errorMsg, error);
      if(error.message.split(':')[0]=== 'AUTH'){
         logout()
      }else{
      this.alertMsg = errorMsg;
      this.alertIsError = true;
      this.showAlert = true;
      }
    },
    async editPet() {
      try{
         const data = await PUT(`${PET_API}/sheds/${this._id}`, this.fields );
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
          class="edit-tbl-data-btn"
          v-bind="props"
        >
          <v-icon>fa:fas fa-thin fa-pencil</v-icon>
        </v-btn>
      </template>
      <v-sheet
        class="ma-1 pa-3"
      >
        <v-card
          class="ma-3 pa-3"
        >
          <v-card-title>Edit Shed Data</v-card-title>
          <v-card
            variant="flat"
          >
            <v-row>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  type="date"
                  v-model="fields.pinkBelly"
                  label="Pink Belly Date"
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="fields.blueEyes"
                  type="date"
                  label="Date Eyes Went Blue"
                />
              </v-col>
              <v-col 
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="fields.clearEyes"
                  type="date"
                  label="Date Eyes Cleared"
                />
              </v-col>
              <v-col 
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="fields.shedSkin"
                  type="date"
                  label="Date Skin Shed"
                />
              </v-col>
              <v-col 
                cols="12"
                sm="6"
              >
                <v-switch
                  v-model="fields.entire"
                  hide-details
                  true-value="Entire"
                  false-value="Not Entire"
                  :label="`${fields.entire}`"
                  inset
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="fields.shedComments"
                  label="Comments"
                />
              </v-col>
            </v-row>
          </v-card>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="error"
              variant="text"
              @click="($event: any) => modalIsOpen = false"
            >
              Close
            </v-btn>
            <v-btn
              color="info"
              variant="text"
              @click="editPet"
            >
              Save
            </v-btn>
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
      </v-sheet>
    </v-dialog>
  </v-row>
</template>

<style lang="css" scoped>

</style>
