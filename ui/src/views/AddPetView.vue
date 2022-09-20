<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>
<script lang="ts">
const API_URL = `/api/pets/add`;

export default {
  data: () => ({
    myPet: {
      name: "",
      type: "",
      species: "",
      sex: "",
      dateOfBirth: "",
      description: "",
    },
  }),

  watch: {},

  methods: {
    async createPet() {
      const url = `${API_URL}`;
      this.myPet = await (await fetch(url)).json();
    },
  },
};
</script>

<template>
  <form class="add-pet-form">
    <input v-model="myPet.name" type="text" placeholder="Name" name="name" />
    <select v-model="myPet.type" placeholder="Type" name="type"></select>
    <input
      v-model="myPet.species"
      type="text"
      placeholder="Species"
      name="species"
    />
    <select v-model="myPet.sex" placeholder="Sex" name="sex"></select>
    <input
      v-model="myPet.dateOfBirth"
      type="date"
      placeholder="Date of Birth"
      name="dateOfBirth"
    />
    <textarea
      v-model="myPet.description"
      type="text"
      placeholder="Description"
      name="species"
    ></textarea>
    <button type="submit">Add This Pet</button>
  </form>
</template>

<style scoped lang="css">
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
}
</style>
