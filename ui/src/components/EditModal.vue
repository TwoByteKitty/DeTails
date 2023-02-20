<script setup lang="ts">
/*@ts-ignore */
import { PetType } from '@/shared/PetType';
import { ref } from 'vue';

export interface EditPetProps {
  _id: string;
  name: string;
  type: string;
  species: string;
  dateOfBirth: string;
  description: string;
}
defineProps<EditPetProps>();
</script>

<script lang="ts">
const API_URL = `/api/pets/`;

export default {
  data() {
    return {
      dialog: false,
      fields: {
        _id: this._id,
        species: this.species,
        type: this.type,
        dateOfBirth: this.dateOfBirth,
        description: this.description,
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
    species: {
      immediate: true,
      handler(newVal) {
        this.fields.species = newVal;
      },
    },
    type: {
      immediate: true,
      handler(newVal) {
        this.fields.type = newVal;
      },
    },
    dateOfBirth: {
      immediate: true,
      handler() {
        this.fields.dateOfBirth = this.dateOfBirth;
      },
    },
    description: {
      immediate: true,
      handler(newVal) {
        this.fields.description = newVal;
      },
    },
  },
  methods: {
    async editPet() {
      const url = `${API_URL}/${this.$route.params.id}`;

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
      <template v-slot:activator="{ props }">
        <v-btn style="height: 66px; width: 66px" v-bind="props"><v-icon>fa:fas fa-thin fa-pen-to-square</v-icon></v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Edit {{ name }}'s Info</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-select :items="PetType" v-model="fields.type" label="Type"></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="fields.species" label="Species"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="fields.dateOfBirth" label="Date of Birth" type="date"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="fields.description" label="Description"></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="dialog = false"> Close </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="editPet"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style lang="css" scoped></style>
