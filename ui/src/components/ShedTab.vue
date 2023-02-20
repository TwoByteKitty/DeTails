<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import 'chartjs-plugin-style';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ref } from 'vue';
import { DateTime } from 'luxon';
import 'chartjs-adapter-luxon';

export interface ShedProps {
  shedHistory: Array<{}>;
}
defineProps<ShedProps>();
</script>

<script lang="ts">
interface IShed {
  _id: string;
  pinkBelly: string;
  blueEyes: string;
  clearEyes: string;
  shedSkin: string;
  entire: string;
  comments: string;
}

const API_URL = `/api/pets/`;
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartDataLabels);
const defaultShed: IShed = {
  _id: '',
  pinkBelly: '',
  blueEyes: '',
  clearEyes: '',
  shedSkin: '',
  entire: 'Not Entire',
  comments: '',
};
const errorMsg = 'There was an error! Uh-oh...';
const successMsg = "Hi! I'm a success alert! Congratulations!";

export default {
  name: 'BarChart',
  components: { Bar },
  data() {
    return {
      alertType: 'success',
      alertMsg: successMsg,
      showAlert: false,
      shedCycles: [],
      newShed: { ...defaultShed },
      chart_type: 'justify',
      chartOptions: {
        responsive: true,
        scales: {
          y: {
            stacked: true,
          },
        },
      },
    };
  },
  components: { Datepicker },
  setup() {
    const date = ref(new Date());
    return {
      date,
    };
  },
  // computed: {
  //   chartData() {
  //     return {
  //       labels: this.weightHistory.map(({ weighDate }) =>
  //         DateTime.fromISO(weighDate).toLocaleString(DateTime.DATE_MED)
  //       ),
  //       datasets: [
  //         {
  //           label: 'weight in grams',
  //           tension: 0.3,
  //           data: this.weightHistory.map(({ weighAmt }) => weighAmt),
  //           borderColor: 'rgba(56, 30, 114, 1)',
  //           backgroundColor: 'rgba(56, 30, 114, 0.75)',
  //           borderWidth: 3,
  //           pointRadius: 9,
  //           pointStyle: 'rectRounded',
  //           rotation: 45,
  //           hoverRadius: 12,
  //           hitRadius: 3,
  //         },
  //       ],
  //     };
  //   },
  // },
  methods: {
    formatDate(timestamp: string) {
      return DateTime.fromISO(timestamp).toLocaleString(DateTime.DATE_SHORT);
    },

    createShed() {
      const url = `${API_URL}${this.$route.params.id}/sheds/add`;
      console.log(this.newShed);

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.newShed),
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

            this.newShed = { ...defaultShed };
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
    <v-card class="ma-3 pa-6">
      <v-row>
        <v-col>
          <!-- <v-sheet class="ma-3 pa-6">
            <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
          </v-sheet> -->
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
              <Datepicker v-model="newShed.pinkBelly" :enable-time-picker="false" auto-apply dark />
            </v-col>
            <v-col>
              <label>Blue Eyes</label>
              <Datepicker v-model="newShed.blueEyes" :enable-time-picker="false" auto-apply dark />
            </v-col>
            <v-col>
              <label>Eyes Cleared</label>
              <Datepicker v-model="newShed.clearEyes" :enable-time-picker="false" auto-apply dark />
            </v-col>
            <v-col>
              <label>Skin Shed</label>
              <Datepicker v-model="newShed.shedSkin" :enable-time-picker="false" auto-apply dark />
            </v-col>
            <v-col>
              <v-switch
                v-model="newShed.entire"
                hide-details
                true-value="Entire"
                false-value="Not Entire"
                :label="`${newShed.entire}`"
                inset
              ></v-switch>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea v-model="newShed.comments" label="Comments" variant="outlined"></v-textarea>
            </v-col>
          </v-row>
          <div class="shed-btn-div d-flex justify-space-around align-center flex-column flex-md-row fill-height">
            <v-btn class="shed-btn elevation-9" size="x-large" @click="createShed()"> Add New Shed Cycle Data </v-btn>
          </div>
          <div>
            <v-alert v-model="showAlert" :type="alertType" variant="tonal" closable close-label="Close Alert">{{
              alertMsg
            }}</v-alert>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="shed-table">
          <v-table class="data-tbl" fixed-header>
            <thead>
              <tr>
                <th class="tbl-head text-left">Pink Belly</th>
                <th class="tbl-head text-left">Blue Eyes</th>
                <th class="tbl-head text-left">Clear Eyes</th>
                <th class="tbl-head text-left">Skin Shed</th>
                <th class="tbl-head text-left">Entire?</th>
                <th class="tbl-head text-left">Comments</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in (shedHistory as Array<IShed>)" :key="item._id">
                <td>{{ formatDate(item.pinkBelly) }}</td>
                <td>{{ formatDate(item.blueEyes) }}</td>
                <td>{{ formatDate(item.clearEyes) }}</td>
                <td>{{ formatDate(item.shedSkin) }}</td>
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
