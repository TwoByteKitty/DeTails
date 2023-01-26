<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<script lang="ts">
export default {
  props: {
    name: String,
    type: String,
    species: String,
    dateOfBirth: String,
    description: String,
    avatarPic: Image,
  },
  data: () => ({
    dialog: false,
    speciesToEdit: '',
  }),
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
                <v-select :items="['0-17', '18-29', '30-54', '54+']" label="Type"></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="speciesToEdit" label="Species"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Date of Birth" type="date"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea label="Description"></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="dialog = false"> Close </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="dialog = false"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style lang="css" scoped></style>
