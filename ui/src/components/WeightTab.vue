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
      weightHistory: [
        {
          id: 1,
          weighDate: '07-05-2022',
          weight: '708',
          comments: 'blah blah blah',
        },
        {
          id: 2,
          weighDate: '09-09-2022',
          weight: '912',
          comments: 'blah blah blah',
        },
        {
          id: 3,
          weighDate: '11-22-2022',
          weight: '1002',
          comments: 'blah blah blah',
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
    <v-row>
      <v-col>
        <v-card class="ma-3 pa-6">
          <v-row>
            <v-col>
              <v-sheet class="ma-3 pa-6">
                <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
              </v-sheet>
            </v-col>
          </v-row>
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
          <v-row>
            <v-col>
              <v-card class="elevation-6 ma-3 pa-6">
                <v-card-title>Add New Weight Data</v-card-title>
                <v-row class="d-flex justify-center align-center">
                  <v-col>
                    <label>Weighing Date</label>
                    <div class="pb-22">
                      <Datepicker v-model="date" auto-apply dark />
                    </div>
                  </v-col>
                  <v-col>
                    <label>Weight Amount (in grams)</label>
                    <v-text-field type="number" suffix="g"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-textarea label="Comments" rows="2"></v-textarea>
                  </v-col>
                </v-row>
                <div
                  class="weight-btn-div d-flex justify-space-around align-center flex-column flex-md-row fill-height"
                >
                  <v-btn class="weight-btn elevation-9" size="x-large"> Add New Weight Data </v-btn>
                </div>
              </v-card>
            </v-col>
          </v-row>
          <v-card class="weight-table pa-3">
            <v-card-title>Weight History</v-card-title>
            <v-table fixed-header>
              <thead>
                <tr>
                  <th class="tbl-head text-left">Record No.</th>
                  <th class="tbl-head text-left">Date</th>
                  <th class="tbl-head text-left">Weight</th>
                  <th class="tbl-head text-left">Comments</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in weightHistory" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>{{ item.weighDate }}</td>
                  <td>{{ item.weight }}</td>
                  <td>{{ item.comments }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="css" scoped>
.pb-22 {
  padding-bottom: 22px;
}
.weight-btn {
  background-color: var(--md-ref-palette-primary50);
  margin: 12px;
  width: 600px;
  height: 60px;
}
.weight-table,
.tbl-head {
  background-color: #4a454e !important;
}
</style>
