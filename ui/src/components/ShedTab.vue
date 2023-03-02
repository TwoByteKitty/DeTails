<script setup lang="ts">
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import 'chartjs-adapter-luxon';
import 'chartjs-plugin-style';
import { DateTime } from 'luxon';
import { ref } from 'vue';
import { Bar } from 'vue-chartjs';

export interface ShedProps {
  shedHistory: Array<IShed>;
}
defineProps<ShedProps>();
</script>

<script lang="ts">
interface IShed {
  _id?: string;
  pinkBelly: string;
  blueEyes: string;
  clearEyes: string;
  shedSkin: string;
  entire: string;
  shedComments?: string;
}

const API_URL = `/api/pets/`;
//ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartDataLabels);
const defaultShed: IShed = {
  _id: '',
  pinkBelly: '',
  blueEyes: '',
  clearEyes: '',
  shedSkin: '',
  entire: 'Not Entire',
  shedComments: '',
};
const errorMsg = 'There was an error! Uh-oh...';
const successMsg = "Hi! I'm a success alert! Congratulations!";
const DATE_FORMAT_STRING = 'yyyy-MM-dd';

const getShedCycleStartDates = (shedHistory: Array<IShed>) =>
  shedHistory.map(({ pinkBelly }) => DateTime.fromISO(pinkBelly).toLocaleString(DateTime.DATE_FULL));

const getShedPhaseDuration = (shedHistory: Array<IShed>, phase: string): Array<number> => {
  let durations = new Array<number>();
  console.log(phase);
  switch (phase) {
    case 'pink':
      durations = shedHistory.map((shed) => {
        const pinkDate = DateTime.fromISO(shed.pinkBelly);
        const blueDate = DateTime.fromISO(shed.blueEyes);

        return blueDate.diff(pinkDate, 'days', { conversionAccuracy: 'casual' }).days;
      });
      break;
    case 'blue':
      durations = shedHistory.map((shed) => {
        const blueDate = DateTime.fromISO(shed.blueEyes);
        const clearDate = DateTime.fromISO(shed.clearEyes);

        return clearDate.diff(blueDate, 'days', { conversionAccuracy: 'casual' }).days;
      });
      break;
    case 'clear':
      durations = shedHistory.map((shed) => {
        const clearDate = DateTime.fromISO(shed.clearEyes);
        const shedDate = DateTime.fromISO(shed.shedSkin);

        return shedDate.diff(clearDate, 'days', { conversionAccuracy: 'casual' }).days;
      });
      break;
    default:
      break;
  }
  console.log(durations);
  return durations;
};

// const getXAxisMinMax = (shedHistory: Array<IShed>) => {
//   const dates = shedHistory.map(({ pinkBelly }) => DateTime.fromISO(pinkBelly));

//   const firstDate = dates[0].minus({ months: 1 });
//   const lastDate = dates[dates.length - 1].plus({ months: 1 });
//   const duration = lastDate.diff(firstDate, ['months']);

//   return {
//     firstDate: firstDate.toFormat(DATE_FORMAT_STRING),
//     lastDate: lastDate.toFormat(DATE_FORMAT_STRING),
//     duration: Math.ceil(duration.months),
//   };
// };

export default {
  name: 'ShedTab',
  components: { Datepicker, Bar },
  data() {
    return {
      alertType: 'success',
      alertMsg: successMsg,
      showAlert: false,
      shedCycles: [],
      newShed: {
        ...defaultShed,
      },
      chartOptions: {
        responsive: true,
        scales: {
          x: {
            // type: 'time',
            // min: getXAxisMinMax(this.shedHistory).firstDate,
            // max: getXAxisMinMax(this.shedHistory).lastDate,
            stacked: true,
            display: true,
            title: {
              display: true,
              text: 'Shed Cycle Start Date',
              color: '#4A4458',
              font: {
                family: 'Garamond',
                size: 30,
                weight: 'bold',
                lineHeight: 1.5,
              },
            },
            ticks: {
              font: {
                weight: 'bold',
                size: 15,
              },
              padding: 15,
              backdropPadding: 6,
            },
          },
          y: {
            stacked: true,
            display: true,
            title: {
              display: true,
              text: 'Number of Days',
              color: '#4A4458',
              font: {
                family: 'Garamond',
                size: 30,
                weight: 'bold',
                lineHeight: 1.5,
              },
            },
            ticks: {
              font: {
                weight: 'bold',
                size: 15,
              },
              padding: 12,
              backdropPadding: 6,
            },
          },
        },
      },
      currentSort: {
        key: 'pinkBelly',
        type: 'date',
        order: 1,
      },
    };
  },
  setup() {
    const date = ref(new Date());
    return {
      date,
    };
  },
  computed: {
    chartData() {
      return {
        labels: getShedCycleStartDates(this.shedHistory),
        datasets: [
          {
            label: 'Pink Belly',
            data: getShedPhaseDuration(this.shedHistory, 'pink'),
            backgroundColor: 'rgb(158, 132, 152)',
          },
          {
            label: 'Blue Eyes',
            data: getShedPhaseDuration(this.shedHistory, 'blue'),
            backgroundColor: 'rgb(97, 84, 106)',
          },
          {
            label: 'Eyes Cleared',
            data: getShedPhaseDuration(this.shedHistory, 'clear'),
            backgroundColor: 'rgb(60, 54, 63)',
          },
        ],
      };
    },
    sortedHistory() {
      return [...this.shedHistory].sort(this.sortMethods(this.currentSort));
    },
    // chartBoxWidth() {
    //   console.log(getXAxisMinMax(this.shedHistory).duration);
    //   const widthObj = { width: '0px' };
    //   const totalLabels = getXAxisMinMax(this.shedHistory).duration;
    //   if (totalLabels > 5) {
    //     widthObj.width = `${1500 + (totalLabels - 5) * 42}px`;
    //   }
    //   return widthObj;
    // },
  },
  methods: {
    formatDate(timestamp: string) {
      return DateTime.fromISO(timestamp).toLocaleString(DateTime.DATE_SHORT);
    },

    createShed() {
      const url = `${API_URL}${this.$route.params.id}/sheds/add`;
      delete this.newShed._id;

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
            this.$emit('shedAdded');
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
    sort: function (sortKey: string, sortType: string) {
      this.currentSort.key = sortKey;
      this.currentSort.type = sortType;
      this.currentSort.order *= -1;
    },
    sortMethods({ key, type, order }: { key: string; type: string; order: number }) {
      switch (type) {
        case 'string': {
          return order === 1
            ? (a: IShed, b: IShed) =>
                b[key as keyof IShed] > a[key as keyof IShed]
                  ? -1
                  : a[key as keyof IShed] > b[key as keyof IShed]
                  ? 1
                  : 0
            : (a: IShed, b: IShed) =>
                a[key as keyof IShed] > b[key as keyof IShed]
                  ? -1
                  : b[key as keyof IShed] > a[key as keyof IShed]
                  ? 1
                  : 0;
        }
        case 'number': {
          console.log('Sorting by number');
          console.log(this.currentSort);
          return order === 1
            ? (a: IShed, b: IShed) => Number(b[key as keyof IShed]) - Number(a[key as keyof IShed])
            : (a: IShed, b: IShed) => Number(a[key as keyof IShed]) - Number(b[key as keyof IShed]);
        }
        case 'date': {
          console.log('Sorting by date');
          console.log(this.currentSort);
          if (order === 1) {
            return (a: IShed, b: IShed) =>
              DateTime.fromISO(b[key as keyof IShed] as string) < DateTime.fromISO(a[key as keyof IShed] as string)
                ? 1
                : DateTime.fromISO(b[key as keyof IShed] as string) > DateTime.fromISO(a[key as keyof IShed] as string)
                ? -1
                : 0;
          } else {
            return (a: IShed, b: IShed) =>
              DateTime.fromISO(a[key as keyof IShed] as string) < DateTime.fromISO(b[key as keyof IShed] as string)
                ? 1
                : DateTime.fromISO(a[key as keyof IShed] as string) > DateTime.fromISO(b[key as keyof IShed] as string)
                ? -1
                : 0;
          }
        }
      }
    },
  },
};
</script>

<template>
  <v-container fluid>
    <v-card class="ma-3 pa-6">
      <v-row>
        <v-col>
          <div class="chart-card">
            <div class="chart-box ma-3 pa-6" :style="chartBoxWidth">
              <Bar id="shed-chart" :options="chartOptions" :data="chartData" />
            </div>
          </div>
        </v-col>
      </v-row>
      <v-card class="ma-3 pa-6" flat>
        <v-row>
          <v-col class="d-flex justify-center align-center">
            <!-- <v-btn-toggle v-model="chart_type" variant="outlined">
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
            </v-btn-toggle> -->
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
              <Datepicker
                v-model="newShed.pinkBelly"
                model-type="yyyy-MM-dd"
                :enable-time-picker="false"
                auto-apply
                dark
              />
            </v-col>
            <v-col>
              <label>Blue Eyes</label>
              <Datepicker
                v-model="newShed.blueEyes"
                model-type="yyyy-MM-dd"
                :enable-time-picker="false"
                auto-apply
                dark
              />
            </v-col>
            <v-col>
              <label>Eyes Cleared</label>
              <Datepicker
                v-model="newShed.clearEyes"
                model-type="yyyy-MM-dd"
                :enable-time-picker="false"
                auto-apply
                dark
              />
            </v-col>
            <v-col>
              <label>Skin Shed</label>
              <Datepicker
                v-model="newShed.shedSkin"
                model-type="yyyy-MM-dd"
                :enable-time-picker="false"
                auto-apply
                dark
              />
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
              <v-textarea v-model="newShed.shedComments" label="Comments" variant="outlined"></v-textarea>
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
                <th class="tbl-head text-left">
                  <a href="#" @click.prevent="sort('pinkBelly', 'date')">Pink Belly</a>
                </th>
                <th class="tbl-head text-left">
                  <a href="#" @click.prevent="sort('blueEyes', 'date')">Blue Eyes</a>
                </th>
                <th class="tbl-head text-left">
                  <a href="#" @click.prevent="sort('clearEyes', 'date')">Clear Eyes</a>
                </th>
                <th class="tbl-head text-left">
                  <a href="#" @click.prevent="sort('shedSkin', 'date')">Skin Shed</a>
                </th>
                <th class="tbl-head text-left"><a href="#" @click.prevent="sort('entire', 'string')">Entire?</a></th>
                <th class="tbl-head text-left">Comments</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in (sortedHistory as Array<IShed>)" :key="item._id">
                <td>{{ formatDate(item.pinkBelly) }}</td>
                <td>{{ formatDate(item.blueEyes) }}</td>
                <td>{{ formatDate(item.clearEyes) }}</td>
                <td>{{ formatDate(item.shedSkin) }}</td>
                <td>{{ item.entire === 'Not Entire' ? 'N' : 'Y' }}</td>
                <td>{{ item.shedComments }}</td>
              </tr>
            </tbody>
          </v-table>
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
