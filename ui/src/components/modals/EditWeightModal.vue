<script lang="ts">
import { WeighUnits } from '@/shared/SelectLists';
import Datepicker from '@vuepic/vue-datepicker';
import { DateTime } from 'luxon';


const API_URL = `/api/pets/weights`;
const DATE_FORMAT_STRING = 'yyyy-MM-dd';
const errorMsg = 'Well... you really screwed up this time...';
const successMsg = "I'm a success alert! Congratulations!";


export default {
  name: 'EditWeightModal',
  components:{ Datepicker },
  emits: [ 'weightAdded' ],
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
    async editPet() {
      const url = `${API_URL}/${this._id}`;

      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...this.fields }),
      };

      fetch(url, requestOptions)
        .then(async (response) => {
          const data = await response.json();

          // check for error response
          if (!response.ok) {
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          } else {
            console.log(data);
            this.$emit('weightAdded');
            this.alertMsg = successMsg;
            this.alertIsError = false;
            this.showAlert = true;

            setTimeout(() => {
              this.showAlert = false;
              this.modalIsOpen = false;
            }, 1000);
          }
        })
        .catch((error) => {
          console.error(errorMsg, error);
          this.alertMsg = errorMsg;
          this.alertIsError = true;
          this.showAlert = true;
        });
    },
    formatDate(timestamp: string) {
      return DateTime.fromISO(timestamp).toFormat(DATE_FORMAT_STRING);
    },
  },
};
</script>

<template>
  <v-row justify="center">
    <v-dialog v-model="modalIsOpen" persistent>
      <template #activator="{ props }">
        <v-btn style="height: 51px; width: 51px" v-bind="props">
          <v-icon>fa:fas fa-thin fa-pencil</v-icon>
        </v-btn>
      </template>
      <v-card title="Edit Weight Data">
        <v-card>
          <v-row>
            <v-col cols="12" sm="6">
              <Datepicker
                v-model="fields.weighDate"
                model-type="yyyy-MM-dd"
                auto-apply
                dark
                label="Date"
              />
            </v-col>
            <v-col cols="12" sm="6">
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

<style lang="css" scoped></style>
