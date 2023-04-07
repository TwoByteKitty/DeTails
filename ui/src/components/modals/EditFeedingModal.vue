<script lang="ts">
import { PreyType, DegreeOfDead } from '@/shared/SelectLists';
import { useAuthStore } from '@/stores/auth.store';
import { PET_API, PUT } from '@/utils/fetch';
import { DateTime } from 'luxon';

const DATE_FORMAT_STRING = 'yyyy-MM-dd';
const errorMsg = 'Well... you really screwed up this time...';
const successMsg = "I'm a success alert! Congratulations!";


export default {
  name: 'EditFeedingModal',
  components:{ },
  emits: [ 'feedingEdited' ],
  props: {
      // eslint-disable-next-line vue/prop-name-casing
      _id: { type: String, required: true },
      feedDate: { type: String, required: true },
      preyNo: { type: Number, required: true },
      preyType: { type: Array<String>, required: true },
      dOD: { type: String, required: true },
      mealWeight: { type: Number, required: true },
      eaten: { type: String, required: true },
      feedComments: { type: String, required: true },
  },
  data() {
    return {
      PreyType,
      DegreeOfDead,
      modalIsOpen: false,
      alertType: 'success',
      alertIsError: false,
      alertMsg: successMsg,
      showAlert: false,
      fields: {
        _id: this.id,
        feedDate: this.formatDate(this.feedDate),
        preyNo: this.preyNo,
        preyType: this.preyType,
        dOD: this.dOD,
        mealWeight: this.mealWeight,
        eaten: this.eaten,
        feedComments: this.feedComments,
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
    feedDate: {
      immediate: true,
      handler(newVal) {
        this.fields.feedDate = this.formatDate(newVal);
      },
    },
    preyNo: {
      immediate: true,
      handler(newVal) {
        this.fields.preyNo = newVal;
      },
    },
    preyType: {
      immediate: true,
      handler(newVal) {
        this.fields.preyType = newVal;
      },
    },
    dOD: {
      immediate: true,
      handler(newVal) {
        this.fields.dOD = newVal;
      },
    },
    mealWeight: {
      immediate: true,
      handler(newVal) {
        this.fields.mealWeight = newVal;
      },
    },
    eaten: {
      immediate: true,
      handler(newVal) {
        this.fields.eaten = newVal;
      },
    },
    feedComments: {
      immediate: true,
      handler(newVal) {
        this.fields.feedComments = newVal;
      },
    },
  },
  methods: {
    editSuccess(data: any){
      console.log(data);
      this.$emit('feedingEdited');
      this.alertMsg = successMsg;
      this.alertIsError = false;
      this.showAlert = true;
      setTimeout(() => {
        this.showAlert = false;
        this.modalIsOpen = false;
      }, 900);
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
         const data = await PUT(`${PET_API}/feedings/${this._id}`, this.fields);
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
        class="pa-3"
      >
      <v-card
        class="ma-3 pa-3 elevation-6"
      >
        <v-card-title>Edit Feeding Data</v-card-title>
        <v-card
          class="ma-1 pa-3"
          variant="flat"
        >
          <v-row>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                type="date"
                v-model="fields.feedDate"
                label="Date"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="fields.preyNo"
                type="number"
                label="No. of Prey Items"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <v-select
                v-model="fields.preyType"
                label="Prey Type"
                :items="PreyType"
                multiple
              />
            </v-col>
            <v-col 
              cols="12"
              sm="6"
            >
              <v-select
                v-model="fields.dOD"
                label="Degree of Deadness"
                :items="DegreeOfDead"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="fields.mealWeight"
                type="number"
                label="Total Meal Weight(in grams)"
              />
            </v-col>
            <v-col
              cols="6"
            >
              <div class="eaten-btn-div d-flex justify-space-around align-center flex-column flex-md-row fill-height">
                <v-switch
                  v-model="fields.eaten"
                  hide-details
                  true-value="Eaten"
                  false-value="Not Eaten"
                  :label="`${fields.eaten}`"
                  inset
                />
              </div>
            </v-col>
            <v-col 
              cols="12"
            >
              <v-textarea
                v-model="fields.feedComments"
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
