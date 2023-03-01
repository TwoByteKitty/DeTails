<script setup lang="ts">
import { Line, Scatter } from 'vue-chartjs';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { DateTime } from 'luxon';
import 'chartjs-plugin-style';

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

const API_URL = `/api/pets/`;
const defaultWeigh: IWeight = {
  _id: '',
  weighDate: '',
  weighAmt: 0,
  weighComments: '',
};
const DATE_FORMAT_STRING = 'yyyy-MM-dd';
const errorMsg = 'Well... you really screwed up this time...';
const successMsg = "I'm a success alert! Congratulations!";

const getXAxisMinMax = (weightHistory: Array<IWeight>) => {
  const dates = weightHistory.map(({ weighDate }) => DateTime.fromISO(weighDate));

  const firstDate = dates[0].minus({ months: 1 });
  const lastDate = dates[dates.length - 1].plus({ months: 1 });
  const duration = lastDate.diff(firstDate, ['months']);

  return {
    firstDate: firstDate.toFormat(DATE_FORMAT_STRING),
    lastDate: lastDate.toFormat(DATE_FORMAT_STRING),
    duration: Math.ceil(duration.months),
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
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'month',
            },
            min: getXAxisMinMax(this.weightHistory).firstDate,
            max: getXAxisMinMax(this.weightHistory).lastDate,
            ticks: {
              font: {
                weight: 'bold',
                size: 15,
              },
              padding: 9,
              backdropPadding: 3,
            },
            display: true,
            title: {
              display: true,
              text: 'Weigh Date',
              color: '#4A4458',
              font: {
                family: 'Garamond',
                size: 30,
                weight: 'bold',
                lineHeight: 1.5,
              },
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 200,
              font: {
                size: 15,
              },
              padding: 9,
              backdropPadding: 3,
            },
            type: 'linear',
            grace: 200,
            display: true,
            title: {
              display: true,
              text: 'Weight in Grams',
              color: '#4A4458',
              font: {
                family: 'Garamond',
                size: 30,
                weight: 'bold',
                lineHeight: 1.5,
              },
            },
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
            // bevelWidth: 21,
            // bevelHighlightColor: 'rgba(255, 255, 255, 1)',
            // bevelShadowColor: 'rgba(0, 0, 0, 1)',
            titleFont: {
              size: 20,
            },
            bodyFont: {
              size: 20,
            },
            caretPadding: 3,
            caretSize: 9,
            usePointStyle: true,
            boxPadding: 3,
            callbacks: {
              title: (context: { parsed: { x: number } }[]) => {
                console.log(context);
                const d = DateTime.fromMillis(context[0].parsed.x);
                return d.toLocaleString(DateTime.DATE_FULL);
              },
            },
          },
        },
        layout: {
          padding: 15,
        },
      },
      // chartPlugins: [
      //   {

      //   },
      // ],
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
            borderWidth: 3.9,
            pointRadius: 9,
            pointHoverRadius: 15,
            pointStyle: 'rectRounded',
            rotation: 45,
            tension: 0.39,
            // pointShadowOffsetX: 6,
            // pointShadowOffsetY: 6,
            // pointShadowBlur: 30,
            // pointShadowColor: 'rgba(220, 54, 46, 1)',
            data: this.weightHistory.map(({ weighAmt, weighDate }) => ({
              x: DateTime.fromISO(weighDate).toFormat(DATE_FORMAT_STRING),
              y: weighAmt,
            })),
          },
        ],
      };
    },
    sortedHistory() {
      return [...this.weightHistory].sort(this.sortMethods(this.currentSort));
    },
    chartBoxWidth() {
      console.log(getXAxisMinMax(this.weightHistory).duration);
      const widthObj = { width: '0px' };
      const totalLabels = getXAxisMinMax(this.weightHistory).duration;
      if (totalLabels > 5) {
        widthObj.width = `${1500 + (totalLabels - 5) * 42}px`;
      }
      return widthObj;
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
              <div class="chart-card">
                <div class="chart-box" :style="chartBoxWidth">
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
.chart-card {
  height: 700px;
  width: 1800px;
  max-width: 1500px;
  overflow-x: scroll;
  margin: 3px;
  padding: 3px;
}
.chart-box {
  height: 100%;
}
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
