<script lang="ts">
import { errorHandler } from '@/shared/errorHandler';
import { WeighUnits } from '@/shared/SelectLists';
import { useAuthStore } from '@/stores/auth.store';
import { PET_API, PUT } from '@/utils/fetch';
import { DateTime } from 'luxon';

const DATE_FORMAT_STRING = 'yyyy-MM-dd';
const errorMsg = 'You really screwed up this time...';
const successMsg = 'Edit successful! Congratulations!';

export default {
  name: 'EditWeightModal',
  components:{ },
  emits: [ 'weightEdited' ],
  props: {
      // eslint-disable-next-line vue/prop-name-casing
      _id: { type: String, required: true },
      weighDate: { type: String, required: true },
      weighAmt: { type: Number, required: true },
      weighUnits: { type: String, required: true },
      weighComments: { type: String, required: true },
  },
  data() {
    return {
      WeighUnits,
      modalIsOpen: false,
      alertType: 'success',
      alertIsError: false,
      alertMsg: successMsg,
      showAlert: false,
      fields: {
        _id: this.id,
        weighDate: this.formatDate(this.weighDate),
        weighAmt: this.weighAmt,
        weighUnits: this.weighUnits,
        weighComments: this.weighComments,
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
    weighDate: {
      immediate: true,
      handler(newVal) {
        this.fields.weighDate = this.formatDate(newVal);
      },
    },
    weighAmt: {
      immediate: true,
      handler(newVal) {
        this.fields.weighAmt = newVal;
      },
    },
    weighUnits: {
      immediate: true,
      handler(newVal) {
        this.fields.weighUnits = newVal;
      },
    },
    weighComments: {
      immediate: true,
      handler(newVal) {
        this.fields.weighComments = newVal;
      },
    },
  },
  methods: {
    editSuccess(){
      this.$emit('weightEdited');
      this.alertMsg = successMsg;
      this.alertIsError = false;
      this.showAlert = true;
      setTimeout(() => {
        this.showAlert = false;
        this.modalIsOpen = false;
      }, 900);
    },
    async editPet() {
      try{
        await PUT(`${PET_API}/weights/${this._id}`, this.fields);
        this.editSuccess();
      }catch(error){
        errorHandler(error, errorMsg, this);
      }
    },
    activatorClick(){
      const { user, logout } = useAuthStore();
      if (!user){
        logout(true);
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
          @click="activatorClick"
        >
          <v-icon>fa:fas fa-thin fa-pencil</v-icon>
        </v-btn>
      </template>
      <v-card title="Edit Weight Data">
        <v-card>
          <v-row>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                type="date"
                v-model="fields.weighDate"
                label="Date"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="fields.weighAmt"
                type="number"
                label="Weigh Amount"
              />
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="fields.weighUnits"
                label="Weight Units"
                :items="WeighUnits"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="fields.weighComments"
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
    </v-dialog>
  </v-row>
</template>

<style lang="css" scoped>

</style>
