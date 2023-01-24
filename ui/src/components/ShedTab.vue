<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ref } from 'vue';
</script>

<script lang="ts">
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
export default {
  name: 'BarChart',
  components: { Bar },
  data() {
    return {
      chart_type: 'justify',
      entireShed: 'Entire',
      chartData: {
        labels: ['January', 'February', 'March'],
        datasets: [{ data: [40, 20, 12] }],
      },
      chartOptions: {
        responsive: true,
      },
      shedCycles: [
        {
          id: 1,
          pinkBelly: '07-01-2022',
          blueEyes: '07-04-2022',
          clearEyes: '07-15-2022',
          shedSkin: '07-21-2022',
          entire: true,
          comments: 'blah blah blah',
        },
        {
          id: 2,
          pinkBelly: '10-11-2022',
          blueEyes: '10-13-2022',
          clearEyes: '10-22-2022',
          shedSkin: '10-24-2022',
          entire: true,
          comments: 'fixed problematic belly scales. blah blah blah',
        },
        {
          id: 3,
          pinkBelly: '12-15-2022',
          blueEyes: '12-16-2022',
          clearEyes: '12-25-2022',
          shedSkin: '12-30-2022',
          entire: false,
          comments: 'bathed at apx 88F for 2 hours to resolve stuck shed. blah blah blah',
        },
      ],
    };
  },
  components: { Datepicker },
  setup() {
    const date = ref(new Date());

    return {
      date,
    };
  },
};
</script>

<template>
  <v-container fluid>
    <v-card class="ma-3 pa-6">
      <v-row>
        <v-col>
          <v-sheet class="ma-3 pa-6">
            <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
          </v-sheet>
        </v-col>
      </v-row>
      <v-card class="ma-3 pa-6" flat>
        <v-row>
          <v-col class="d-flex justify-center align-center">
            <v-btn-toggle v-model="chart_type" variant="outlined">
              <v-btn value="center">
                <span class="hidden-sm-and-down">Gantt</span>

                <v-icon end> mdi-format-align-center </v-icon>
              </v-btn>

              <v-btn value="right">
                <span class="hidden-sm-and-down">Stacked Bar</span>

                <v-icon end> mdi-format-align-right </v-icon>
              </v-btn>

              <v-btn value="justify">
                <span class="hidden-sm-and-down">Chart Type</span>

                <v-icon end> mdi-format-align-justify </v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
      </v-card>
    </v-card>
    <v-row>
      <v-col class="d-flex justify-center align-center"> </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="elevation-6 ma-6 pa-6">
          <v-card-title>Add New Shed Cycle Data</v-card-title>
          <v-row class="d-flex justify-center align-center">
            <v-col>
              <label>Pink Belly</label>
              <Datepicker v-model="date" auto-apply dark />
            </v-col>
            <v-col>
              <label>Blue Eyes</label>
              <Datepicker v-model="date" auto-apply dark />
            </v-col>
            <v-col>
              <label>Eyes Cleared</label>
              <Datepicker v-model="date" auto-apply dark />
            </v-col>
            <v-col>
              <label>Skin Shed</label>
              <Datepicker v-model="date" auto-apply dark />
            </v-col>
            <v-col>
              <v-switch
                v-model="entireShed"
                hide-details
                true-value="Entire"
                false-value="Not Entire"
                :label="`${entireShed}`"
                inset
              ></v-switch>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea label="Comments" variant="outlined" rows="2"></v-textarea>
            </v-col>
          </v-row>
          <div class="shed-btn-div d-flex justify-space-around align-center flex-column flex-md-row fill-height">
            <v-btn class="shed-btn elevation-9" size="x-large"> Add New Shed Cycle Data </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="shed-table">
          <v-table fixed-header>
            <thead>
              <tr>
                <th class="tbl-head text-left">Record No.</th>
                <th class="tbl-head text-left">Pink Belly</th>
                <th class="tbl-head text-left">Blue Eyes</th>
                <th class="tbl-head text-left">Clear Eyes</th>
                <th class="tbl-head text-left">Skin Shed</th>
                <th class="tbl-head text-left">Entire?</th>
                <th class="tbl-head text-left">Comments</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in shedCycles" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ item.pinkBelly }}</td>
                <td>{{ item.blueEyes }}</td>
                <td>{{ item.clearEyes }}</td>
                <td>{{ item.shedSkin }}</td>
                <td>{{ item.entire }}</td>
                <td>{{ item.comments }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="css" scoped>
.v-card {
  padding: 6px;
}
.shed-btn {
  background-color: var(--md-ref-palette-tertiary50);
  margin: 12px;
  width: 600px;
  height: 60px;
}
.shed-table,
.tbl-head {
  background-color: #4a454e !important;
}
</style>
