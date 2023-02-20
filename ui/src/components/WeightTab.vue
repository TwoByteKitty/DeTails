<script setup lang="ts">
import { Line, Scatter } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, TimeScale, LinearScale, PointElement } from 'chart.js';
import 'chartjs-plugin-style';
import 'chartjs-adapter-luxon';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { DateTime } from 'luxon';

export interface WeightProps {
  weightHistory: Array<IWeight>;
}
defineProps<WeightProps>();
</script>

<script lang="ts">
interface IWeight {
  _id?: string;
  weighDate: string;
  weighAmt: number;
  weighComments?: string;
}

const errorMsg = 'Well... you really screwed up this time...';
const successMsg = "I'm a success alert! Congratulations!";
const API_URL = `/api/pets/`;
const defaultWeigh: IWeight = {
  _id: '',
  weighDate: '',
  weighAmt: 0,
  weighComments: '',
};
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, TimeScale, LinearScale);

const getXAxisMinMax = (weightHistory: Array<IWeight>) => {
  const DATE_FORMAT_STRING = 'yyyy-MM-dd';
  const dates = weightHistory.map(({ weighDate }) => DateTime.fromISO(weighDate).toFormat(DATE_FORMAT_STRING));
  const firstDate = DateTime.fromISO(dates[0]).minus({ months: 1 }).toFormat(DATE_FORMAT_STRING);
  const lastDate = dates[dates.length - 1];

  return {
    firstDate,
    lastDate,
  };
};
export default {
  name: 'WeightTab',
  components: { Datepicker, Scatter, Line },
  data() {
    return {
      alertType: 'success',
      alertMsg: successMsg,
      showAlert: false,
      newWeight: {
        ...defaultWeigh,
      },
      chartOptions: {
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'month',
            },
            min: getXAxisMinMax(this.weightHistory).firstDate,
            max: getXAxisMinMax(this.weightHistory).lastDate,
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 200,
            },
            type: 'linear',
            grace: 200,
          },
        },
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
            },
          },
          title: {
            display: true,
            text: 'Weight Over Time',
          },
          tooltip: {
            enable: false,
          },
        },
      },
      currentSort: {
        key: 'weighDate',
        type: 'date',
        order: 1,
      },
    };
  },
  methods: {
    formatDate(timestamp: string) {
      return DateTime.fromISO(timestamp).toLocaleString(DateTime.DATE_SHORT);
    },
    createWeight() {
      const url = `${API_URL}${this.$route.params.id}/weights/add`;
      delete this.newWeight._id;
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
            this.$emit('weightAdded');
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
    sort: function (sortKey: string, sortType: string) {
      this.currentSort.key = sortKey;
      this.currentSort.type = sortType;
      this.currentSort.order *= -1;
    },
    sortMethods({ key, type, order }: { key: string; type: string; order: number }) {
      switch (type) {
        case 'string': {
          return order === 1
            ? (a: IWeight, b: IWeight) =>
                b[key as keyof IWeight] > a[key as keyof IWeight]
                  ? -1
                  : a[key as keyof IWeight] > b[key as keyof IWeight]
                  ? 1
                  : 0
            : (a: IWeight, b: IWeight) =>
                a[key as keyof IWeight] > b[key as keyof IWeight]
                  ? -1
                  : b[key as keyof IWeight] > a[key as keyof IWeight]
                  ? 1
                  : 0;
        }
        case 'number': {
          console.log('Sorting by number');
          console.log(this.currentSort);
          return order === 1
            ? (a: IWeight, b: IWeight) => Number(b[key as keyof IWeight]) - Number(a[key as keyof IWeight])
            : (a: IWeight, b: IWeight) => Number(a[key as keyof IWeight]) - Number(b[key as keyof IWeight]);
        }
        case 'date': {
          console.log('Sorting by date');
          console.log(this.currentSort);
          if (order === 1) {
            return (a: IWeight, b: IWeight) =>
              DateTime.fromISO(b[key as keyof IWeight] as string) < DateTime.fromISO(a[key as keyof IWeight] as string)
                ? 1
                : DateTime.fromISO(b[key as keyof IWeight] as string) >
                  DateTime.fromISO(a[key as keyof IWeight] as string)
                ? -1
                : 0;
          } else {
            return (a: IWeight, b: IWeight) =>
              DateTime.fromISO(a[key as keyof IWeight] as string) < DateTime.fromISO(b[key as keyof IWeight] as string)
                ? 1
                : DateTime.fromISO(a[key as keyof IWeight] as string) >
                  DateTime.fromISO(b[key as keyof IWeight] as string)
                ? -1
                : 0;
          }
        }
      }
    },
  },
  computed: {
    chartData() {
      return {
        datasets: [
          {
            label: 'weight in grams',
            borderColor: 'rgba(56, 30, 114, 1)',
            backgroundColor: 'rgba(56, 30, 114, 0.75)',
            borderWidth: 1,
            // data: [
            //   { x: '2022-09-03', y: 702 },
            //   { x: '2022-09-27', y: 769 },
            //   { x: '2022-10-10', y: 795 },
            //   { x: '2022-10-31', y: 861 },
            //   { x: '2022-11-15', y: 903 },
            //   { x: '2022-11-27', y: 933 },
            //   { x: '2022-12-09', y: 972 },
            //   { x: '2022-12-31', y: 1002 },
            //   { x: '2023-01-21', y: 1099 },
            //   { x: '2023-02-12', y: 1122 },
            //   { x: '2023-04-18', y: 1299 },
            // ],
            data: this.weightHistory.map(({ weighAmt, weighDate }) => ({ x: weighDate, y: weighAmt })),
          },
        ],
      };
    },
    sortedHistory() {
      return [...this.weightHistory].sort(this.sortMethods(this.currentSort));
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
              <div class="chartCard ma-3 pa-6">
                <div class="chartBox">
                  <Line id="my-chart-id" :options="chartOptions" :data="chartData" />
                </div>
              </div>
            </v-col>
          </v-row>
          <!-- <v-row>
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
          </v-row> -->
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
                  <th class="tbl-head text-left"><a href="#" @click.prevent="sort('weighDate', 'date')">Date</a></th>
                  <th class="tbl-head text-left"><a href="#" @click.prevent="sort('weighAmt', 'number')">Weight</a></th>
                  <th class="tbl-head text-left">Comments</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="weight in sortedHistory" :key="weight._id">
                  <td>{{ formatDate(weight.weighDate) }}</td>
                  <td>{{ weight.weighAmt }}</td>
                  <td>{{ weight.weighComments }}</td>
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
