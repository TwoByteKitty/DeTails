<script lang="ts">
import type { IWeight } from '@/shared/IWeight';
import { WeighUnits } from '@/shared/SelectLists';
import type { PropType } from 'vue';


const API_URL = `/api/pets/`;

export default {
    props: {
        weight: { type: {} as PropType<IWeight>, required: true }
    },
  data() {
    return {
      WeighUnits,
      dialog: false,
      fields: {
        _id: this.weight._id,
        weighDate: this.weight.weighDate,
        weighAmt: this.weight.weighAmt,
        weighUnits: this.weight.weighUnits,
        weighComments: this.weight.weighComments,
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
        this.fields.weighDate = newVal;
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
      const url = `${API_URL}/${this.weight._id}`;

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
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }
          console.log(data);
          this.dialog = false;
        })
        .catch((error) => {
          console.error('There was an error!', error);
        });
    },
  },
};
</script>

<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent>
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
            @click="($event: any) => dialog = false"
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
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style lang="css" scoped></style>
