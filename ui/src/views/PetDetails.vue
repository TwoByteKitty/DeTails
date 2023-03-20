<script lang="ts">
import MoreTab from '@/components/tabs/MoreTab.vue';
import { useAuthStore } from '@/stores/auth.store';
import { GET } from '@/utils/fetch';
import FeedingTab from '../components/tabs/FeedingTab.vue';
import OverviewTab from '../components/tabs/OverviewTab.vue';
import ShedTab from '../components/tabs/ShedTab.vue';
import WeightTab from '../components/tabs/WeightTab.vue';

const API_URL = `api/pets/`;
export default {
  components: { OverviewTab, WeightTab, FeedingTab, ShedTab, MoreTab },
  data (){
    return {
      url: API_URL,
      myPet: {
        _id:'',
        name: '',
        type: '',
        species: '',
        sex: '',
        dateOfBirth: '',
        dateOfBirthFormatted:'',
        description: '',
        petImages: [],
        feedingSchedule: [],
        feedingHistory:[],
        shedHistory:[],
        weightHistory:[]
      },
      tab: null,
    };
  },
  created() {
    // fetch on init
    this.getPet();
  },

  methods: {
    async getPet() {
      try{
      // TODO convert to querystring
      this.myPet = await GET(`${API_URL}${this.$route.params.id}`, useAuthStore().user.token);
      }catch(error){
         console.log(error)
      }
    },
  },
};
</script>

<template>
  <v-card>
    <v-card-title
      class="text-h2 mt-9 mr-3 ml-3 mb-3"
    >
      {{ myPet.name }}
    </v-card-title>
    <v-tabs
      v-model="tab"
      color="deep-purple-accent-4"
      align-tabs="center"
    >
      <v-tab :value="1">
        Overview
      </v-tab>
      <v-tab :value="2">
        Feeding
      </v-tab>
      <v-tab :value="3">
        Shed Cycles
      </v-tab>
      <v-tab :value="4">
        Weight
      </v-tab>
      <v-tab :value="5">
        ...& More
      </v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item :value="1">
        <overview-tab
          v-bind="myPet"
          @overview-edited="getPet"
        />
      </v-window-item>
      <v-window-item :value="2">
        <feeding-tab
          v-bind="myPet"
          @feeding-added="getPet"
        />
      </v-window-item>
      <v-window-item :value="3">
        <shed-tab
          v-bind="myPet"
          @shed-added="getPet"
        />
      </v-window-item>
      <v-window-item :value="4">
        <weight-tab
          v-bind="myPet"
          @weight-added="getPet"
        />
      </v-window-item>
      <v-window-item :value="5">
        <more-tab v-bind="myPet" />
      </v-window-item>
    </v-window>
  </v-card>
</template>
