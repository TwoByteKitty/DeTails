<script lang="ts">
const API_URL = `/api/pets/add/`;
// There are two approaches, async or postback, either way the form need validated
export default {
  data: () => ({
    column: null,
    row: null,
    url: API_URL,
    myPet: {
      name: '',
      type: '',
      species: '',
      sex: '',
      dateOfBirth: '',
      description: '',
    },
    petType: ['amphibian', 'bird', 'cat', 'dog', 'fish', 'lizard', 'snake'],
  }),

  watch: {},

  methods: {
    async createPet() {
      // POSSIBLE TODO: make this a post with the data and redirect to MyPetsView
      const url = `${API_URL}`;
      this.myPet = await (await fetch(url)).json();
    },
  },
};
</script>

<template>
  <v-card elevation="2" outlined shaped>
    <!-- <v-snackbar v-model="snackbar" absolute top right color="success">
      <span>Registration successful!</span>
      <v-icon dark> mdi-checkbox-marked-circle </v-icon>
    </v-snackbar> -->
    <form :action="url" method="POST">
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="myPet.name" color="purple darken-2" label="Pet's name" required></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="12">
            <v-select v-model="myPet.type" :items="petType" label="Pet Type" placeholder="Type" solo></v-select>
          </v-col>
          <v-radio-group label="Sex" row>
            <v-radio label="Female" value="female"></v-radio>
            <v-radio label="Male" value="male"></v-radio>
          </v-radio-group>
          <v-col cols="12">
            <v-textarea v-model="myPet.description" color="teal">
              <template v-slot:label>
                <div>Description <small>(optional)</small></div>
              </template>
            </v-textarea>
          </v-col>
        </v-row>
      </v-container>
    </form>
  </v-card>
</template>

<style scoped lang="css">
/* TODO: Styling */
.add-pet-form {
  margin-top: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  flex: 1 0;
  align-items: center;
}
input {
  display: block;
  color: var(--color-text);
}
</style>
