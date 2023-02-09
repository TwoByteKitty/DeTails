<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ref } from 'vue';
import { DateTime } from 'luxon';

export interface WeightProps {
  weightHistory: Array<{}>;
}
defineProps<WeightProps>();
</script>

<script lang="ts">
interface IWeight {
  _id: string;
  weighDate: string;
  weighAmt: number;
  weighComments: string;
}

const errorMsg = 'There was an error! Uh-oh...';
const successMsg = "Hi! I'm a success alert! Congratulations!";
const API_URL = `/api/pets/`;
const defaultWeigh: IWeight = {
  _id: '',
  weighDate: '',
  weighAmt: 0,
  weighComments: '',
};
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  name: 'BarChart',
  components: { Bar, Datepicker },
  data() {
    return {
      alertType: 'success',
      alertMsg: successMsg,
      showAlert: false,
      weightHistory: [],
      newWeight: {
        ...defaultWeigh,
      },
      chart_type: 'justify',
      chartData: {
        labels: ['January', 'February', 'March'],
        datasets: [{ data: [40, 20, 12] }],
      },
      chartOptions: {
        responsive: true,
      },
    };
  },
  setup() {
    const date = ref(new Date());

    return {
      date,
    };
  },
  methods: {
    formatDate(timestamp: string) {
      return DateTime.fromISO(timestamp).toLocaleString(DateTime.DATE_SHORT);
    },
    createWeight() {
      const url = `${API_URL}${this.$route.params.id}/weights/add`;
      console.log(this.newWeight);

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.newWeight),
      };
      this.showAlert = false;

      fetch(url, requestOptions)
        .then(async (response) => {
          const data = await response.json();

          // check for error response
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          } else {
            this.alertMsg = successMsg;
            this.alertType = 'success';
            this.showAlert = true;

            this.newWeight = { ...defaultWeigh };
            setTimeout(() => {
              this.showAlert = false;
            }, 9000);
          }
          console.log(data);
        })
        .catch((error) => {
          console.error(errorMsg, error);
          this.alertMsg = errorMsg;
          this.alertType = 'error';
          this.showAlert = true;
        });
    },
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
                      <Datepicker v-model="newWeight.weighDate" auto-apply dark />
                    </div>
                  </v-col>
                  <v-col>
                    <label>Weight Amount (in grams)</label>
                    <v-text-field v-model="newWeight.weighAmt" type="number" suffix="g"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-textarea v-model="newWeight.weighComments" label="Comments" rows="2"></v-textarea>
                  </v-col>
                </v-row>
                <div
                  class="weight-btn-div d-flex justify-space-around align-center flex-column flex-md-row fill-height"
                >
                  <v-btn class="weight-btn elevation-9" size="x-large" @click="createWeight()">
                    Add New Weight Data
                  </v-btn>
                </div>
                <div>
                  <v-alert v-model="showAlert" :type="alertType" variant="tonal" closable close-label="Close Alert">{{
                    alertMsg
                  }}</v-alert>
                </div>
              </v-card>
            </v-col>
          </v-row>
          <v-card class="weight-table pa-3">
            <v-card-title>Weight History</v-card-title>
            <v-table class="data-tbl" fixed-header>
              <thead>
                <tr>
                  <th class="tbl-head text-left">Date</th>
                  <th class="tbl-head text-left">Weight</th>
                  <th class="tbl-head text-left">Comments</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in (weightHistory as Array<IWeight>)" :key="item._id">
                  <td>{{ formatDate(item.weighDate) }}</td>
                  <td>{{ item.weighAmt }}</td>
                  <td>{{ item.weighComments }}</td>
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
