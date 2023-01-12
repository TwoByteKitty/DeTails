<script lang="ts">
const API_URL = `/api/pets/add/`;
// There are two approaches, async or postback, either way the form need validated
export default {
  data: () => ({
    column: null,
    inline: null,
    url: API_URL,
    myPet: {
      name: '',
      type: null,
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
  <v-card elevation="3" variant="tonal" title="Add a New Pet">
    <!-- <v-snackbar v-model="snackbar" absolute top right color="success">
      <span>Registration successful!</span>
      <v-icon dark> mdi-checkbox-marked-circle </v-icon>
    </v-snackbar> -->
    <form :action="url" method="POST">
      <v-container fluid>
        <v-row>
          <v-col>
            <v-text-field v-model="myPet.name" label="Name"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field v-model="myPet.dateOfBirth" type="date" min="2000-01-01" label="Date of Birth"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select v-model="myPet.type" label="Type" :items="petType" variant="solo"></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field v-model="myPet.species" label="Species"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-radio-group v-model="myPet.sex" inline style="padding: 0 10px">
            <v-radio label="Female" value="female" style="padding-right: 12px"></v-radio>
            <v-radio label="Male" value="male" style="padding-right: 15px"></v-radio>
            <v-radio label="Unknown" value="unknown"></v-radio>
          </v-radio-group>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea v-model="myPet.description" auto-grow label="Description"> </v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-spacer></v-spacer>
          <v-col>
            <v-btn size="x-large" color="success" prepend-icon="mdi-check"> Create </v-btn>
          </v-col>
          <v-spacer></v-spacer>
          <v-col>
            <v-btn size="x-large" color="error" prepend-icon="mdi-cancel"> Cancel </v-btn>
          </v-col>
          <v-spacer></v-spacer>
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
