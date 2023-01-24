<script lang="ts">
const API_URL = `/api/pets/add/`;
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
// There are two approaches, async or postback, either way the form need validated
export default {
  data: () => ({
    url: API_URL,
    myPet: {
      name: '',
      type: '',
      species: '',
      sex: '',
      dateOfBirth: '',
      description: '',
    },
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
  <form class="add-pet-form" :action="url" method="POST">
    <v-icon icon="fas fa-plus" />
    <v-icon icon="mdi:mdi-minus" />
    <input v-model="myPet.name" type="text" placeholder="Name" name="name" />
    <!--TODO: Populate from api-->
    <select v-model="myPet.type" placeholder="Type" name="type"></select>
    <input v-model="myPet.species" type="text" placeholder="Species" name="species" />
    <!--TODO: Populate from api-->

    <v-radio-group v-model="myPet.sex" row>
      <v-radio label="Female" value="female"></v-radio>
      <v-radio label="Male" value="male"></v-radio>
    </v-radio-group>

    <input v-model="myPet.dateOfBirth" type="date" placeholder="Date of Birth" name="dateOfBirth" />
    <textarea v-model="myPet.description" type="text" placeholder="Description" name="species"></textarea>
    <!-- POSSIBLE TODO: make this redirect to MyPetsView on success and handle error as well -->
    <button type="submit">Add This Pet</button>
  </form>
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
