<script lang="ts">
import { useAuthStore } from '@/stores/auth.store';


const API_URL = `/api/pets/`;
const errorMsg = 'Well... you really screwed up this time...';
const successMsg = "I'm a success alert! Congratulations!";

export default {
  name: 'EditOverviewModal',
  emits: [ 'overviewEdited' ],
  props: {
    // eslint-disable-next-line vue/prop-name-casing
    _id: { type: String, required: true, default: '' },
    name: { type: String, required: true, default: '' },
    species: { type: String, required: true, default: '' },
    sex: { type: String, required: true, default: '' },
    dateOfBirth: { type: String, required: true, default: '' },
    description: { type: String, required: false, default: '' },
  },
  data() {
    return {
      modalIsOpen: false,
      alertType: 'success',
      alertIsError: false,
      alertMsg: successMsg,
      showAlert: false,
      fields: {
        _id: this._id,
        name: this.name,
        species: this.species,
        sex: this.sex,
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
    name: {
      immediate: true,
      handler(newVal) {
        this.fields.name = newVal;
      },
    },
    species: {
      immediate: true,
      handler(newVal) {
        this.fields.species = newVal;
      },
    },
    sex: {
      immediate: true,
      handler(newVal) {
        this.fields.sex = newVal;
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
      
      const authStore = useAuthStore();
      const requestOptions = {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-access-token': authStore.user.token 
        },
        body: JSON.stringify({ ...this.fields }),
      };

      fetch(url, requestOptions)
        .then(async (response) => {
          const data = await response.json();

          if (!response.ok) {
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          } else {
            this.$emit('overviewEdited');
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
          style="height: 66px; width: 66px"
          v-bind="props"
        >
          <v-icon>fa:fas fa-thin fa-pen-to-square</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5 ma-6 pa-3">
            Edit {{ name }}'s Info
          </span>
        </v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="fields.name"
                  label="Name"
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="fields.species"
                  label="Species"
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="fields.sex"
                  label="Sex"
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="fields.dateOfBirth"
                  label="Date of Birth"
                  type="date"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="fields.description"
                  label="Description"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <div class="ma-3">
            <v-btn
              color="error"
              variant="text"
              @click="($event: any) => modalIsOpen = false"
            >
              Close
            </v-btn>
          </div>
          <div class="ml-3 mt-3 mb-3 mr-9">
            <v-btn
              color="success"
              variant="text"
              @click="editPet"
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

<style lang="css" scoped></style>