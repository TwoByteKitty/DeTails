<script lang="ts">
import type { IPet } from '@/shared/interfaces/IPet';
import { PetType } from '@/shared/SelectLists.js';
import { useAuthStore } from '@/stores/auth.store';
import { PET_API, POST } from '@/utils/fetch';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { RouterLink } from 'vue-router';

const defaultPet: IPet = {
  name: '',
  type: null,
  species: '',
  sex: 'unknown',
  dateOfBirth: '',
  description: '',
};
const errorMsg = 'Failed to register new pet.';
const successMsg = 'New pet registration succeeded!  ';

export default {
  components: { RouterLink, Datepicker },
  data: () => ({
    PetType,
    showRegResult: false,
    resultIsError: false,
    alertMsg: successMsg,
    myPet: {
      ...defaultPet,
    },
    createdPetId: ''
  }),

  watch: {},

  methods: {
    async createPet() {
      const { user: {userName, token} } = useAuthStore();
      this.showRegResult = false;
      try{
         const data = await POST(`${PET_API}/add`, {pet:this.myPet, userName}, token);
         console.log(data);
         this.alertMsg = successMsg;
         this.resultIsError = false;
         this.showRegResult = true;
         this.myPet = { ...defaultPet };
         this.createdPetId = data._id;
      }catch(error){
         console.log(error);
         this.alertMsg = errorMsg;
         this.resultIsError = true;
         this.showRegResult = true;
      }
    },
  },
};
</script>

<template>
  <v-card
    class="pa-6 ma-6"
    elevation="3"
    variant="tonal"
    title="Add a New Pet"
  >
    <v-alert
      v-model="showRegResult"
      :type="resultIsError ? 'error' : 'success'"
      variant="tonal"
      closable
      close-label="Close Alert"
    >
      {{ alertMsg }}
      <router-link :to="{ name: 'pet-details', params: { id: createdPetId } }">
        <v-btn
          prepend-icon="fa:fas fa-light fa-arrow-up-right"
        >
          Go To Newly Registered Pet's Details
          <v-icon>fa:fas fa-light fa-arrow-up-right</v-icon>
        </v-btn>
      </router-link>
    </v-alert>
    <form>
      <v-container fluid>
        <v-row no-gutters>
          <v-col class="pa-1 mt-3">
            <label>Name</label>
            <v-text-field v-model="myPet.name" />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col class="pa-1">
            <label>Type</label>
            <v-select
              v-model="myPet.type"
              :items="PetType"
              variant="solo"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col class="pa-1">
            <label>Species</label>
            <v-text-field v-model="myPet.species" />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col class="pa-1">
            <label>Date of Birth</label>
            <Datepicker
              v-model="myPet.dateOfBirth"
              model-type="yyyy-MM-dd"
              :enable-time-picker="false"
              dark
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="mt-5">
            <v-radio-group
              v-model="myPet.sex"
              inline
            >
              <v-radio
                label="Female"
                value="female"
                class="pr-6"
              />
              <v-radio
                label="Male"
                value="male"
                class="pr-6"
              />
              <v-radio
                label="Unknown"
                value="unknown"
              />
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea
              v-model="myPet.description"
              auto-grow
              label="Description"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col
            class="pa-3 ma-3"
            style="text-align: center;"
          >
            <v-btn
              style="width: 60%;"
              size="x-large"
              color="success"
              prepend-icon="mdi-check"
              @click="createPet"
            >
              Create
            </v-btn>
          </v-col>
          <v-col
            class="pa-3 ma-3"
            style="text-align: center;"
          >
            <v-btn
              style="width: 60%;"
              size="x-large"
              color="error"
              prepend-icon="mdi-cancel"
            >
              Cancel
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            class="pa-3 ma-3"
            style="text-align: center;"
          >
            <v-btn
              style="width: 75%; margin:auto;"
              size="x-large"
              color="primary"
              prepend-icon="fa:fas fa-light fa-arrow-turn-down-left"
            >
              Return to My Pets
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </form>
  </v-card>
</template>

<style scoped lang="css">
input {
  display: block;
  color: var(--color-text);
}
</style>
