<script lang="ts">
import type { IError } from '@/shared/interfaces/IError';
import type { IPet } from '@/shared/interfaces/IPet';
import { PetType } from '@/shared/SelectLists.js';
import { useAuthStore, USER_KEY } from '@/stores/auth.store';
import { PET_API, POST } from '@/utils/fetch';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { RouterLink } from 'vue-router';
import { useCookies } from 'vue3-cookies';

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
    isValid: false,
    showRegResult: false,
    resultIsError: false,
    alertMsg: successMsg,
    myPet: {
      ...defaultPet,
    },
    createdPetId: '',
    nameRules: [
         (value: string)=>(!!value || 'Name is required.'),
         (value: string)=>{
            if (value?.length > 2) return true
            return 'Name must be at least 2 characters.'
         }
    ],
    typeRules: [
         (value: string)=>(!!value || 'Type is required.'),
    ],
    speciesRules: [
         (value: string)=>(!!value || 'Species is required.'),
         (value: string)=>{
            if (value?.match(/\b[A-Z].*?\b \b[a-z].*?\b/gm)) return true
            return 'Please enter a binomial name in the format: Genus species.'
         }
    ],
  }),

  watch: {},

  methods: {
    async createPet() {
      const form = this.$refs.newPetForm as any;
      const { valid } = await form.validate();
      this.isValid == valid;
      if(valid){
        const { logout } = useAuthStore();
        const { cookies } = useCookies();
        this.showRegResult = false;
        try{
          const data = await POST(`${PET_API}/add`, {pet:this.myPet, userName: cookies.get(USER_KEY)});
          console.log(data);
          this.alertMsg = successMsg;
          this.resultIsError = false;
          this.showRegResult = true;
          this.createdPetId = data._id;
          form.reset();
        }catch(error){
          const caughtError = error as IError;
          console.error(errorMsg, error);
          if(caughtError.type === 'AUTH'){
            logout()
          }else{
            this.alertMsg = errorMsg;
            this.resultIsError = true;
            this.showRegResult = true;
          }
        }
      }
    },
  }
}

</script>

<template>
  <v-card>
    <v-card
      class="pa-9 ma-9"
      elevation="9"
      variant="tonal"
      title="Add a New Pet"
      subtitle="You can edit everything but the type later, so provide your best guess on required fields you aren't sure about."
    >
      <v-alert
        v-model="showRegResult"
        :type="resultIsError ? 'error' : 'success'"
        variant="tonal"
        closable
        close-label="Close Alert"
      >
        {{ alertMsg }}
        <router-link
          v-if="!resultIsError"
          :to="{ name: 'pet-details', query: { id: createdPetId } }"
        >
          <v-btn
            prepend-icon="fa:fas fa-light fa-arrow-up-right"
          >
            Go To Newly Registered Pet's Details
            <v-icon>fa:fas fa-light fa-arrow-up-right</v-icon>
          </v-btn>
        </router-link>
      </v-alert>
      <v-form
        ref="newPetForm"
        v-model="isValid"
        lazy-validation
        @submit.prevent="createPet"
      >
        <v-container fluid>
          <v-row no-gutters>
            <v-col class="pa-1 mt-3">
              <label>Name</label>
              <v-text-field
                v-model="myPet.name"
                :rules="nameRules"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col class="pa-1">
              <label>Type</label>
              <v-select
                v-model="myPet.type"
                :items="PetType"
                :rules="typeRules"
                variant="solo"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col class="pa-1">
              <label>Species</label>
              <v-text-field
                v-model="myPet.species"
                :rules="speciesRules"
                placeholder="Example: Epicrates maurus"
              />
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
              <router-link
                to="/my-pets"
                style="text-decoration: none;"
              >
                <v-btn
                  v-ripple
                  style="width: 75%;"
                  size="x-large"
                  color="primary"
                  prepend-icon="fa:fas fa-duotone fa-arrow-turn-down-left"
                >
                  Return to My Pets
                </v-btn>
              </router-link>
            </v-col>
            <v-col
              class="pa-3 ma-3"
              style="text-align: center;"
            >
              <v-btn
                v-ripple
                style="width: 75%;"
                size="x-large"
                color="success"
                prepend-icon="fa:fas fa-duotone fa-check"
                type="submit"
              >
                Register New Pet
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
  </v-card>
</template>

<style scoped lang="css">
input {
  display: block;
  color: var(--color-text);
}
</style>
