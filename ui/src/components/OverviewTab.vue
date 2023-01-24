<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<script lang="ts">
export default {
  props: {
    type: String,
    species: String,
    dateOfBirth: Date,
    description: String,
    avatarPic: Image,
  },
};
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col>{{ type }} </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
