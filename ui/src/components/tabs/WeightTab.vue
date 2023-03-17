<script lang="ts">
import type { IWeight } from '@/shared/IWeight';
import { WeighUnits } from '@/shared/SelectLists.js';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import 'chartjs-plugin-style';
import { DateTime } from 'luxon';
import type { PropType } from 'vue';
import WeightLineChart from '../charts/WeightLineChart.vue';
import EditWeightModal from '../modals/EditWeightModal.vue';
import { useAuthStore } from '@/stores/auth.store';

const API_URL = `/api/pets/`;
const defaultWeigh: IWeight = {
  _id: '',
  weighDate: '',
  weighAmt: 0,
  weighUnits: '',
  weighComments: '',
};
const errorMsg = 'Well... you really screwed up this time...';
const successMsg = "I'm a success alert! Congratulations!";

export default {
  name: 'WeightTab',
  components: { Datepicker, WeightLineChart, EditWeightModal },
  emits: [ 'weightAdded' ],
  props: {
    weightHistory: { type: Array as PropType<Array<IWeight>>, required: true },
  },
  data() {
    return {
      WeighUnits,
      alertType: 'success',
      alertIsError: false,
      alertMsg: successMsg,
      showAlert: false,
      newWeight: {
        ...defaultWeigh,
      },
      currentSort: {
        key: 'weighDate',
        type: 'date',
        order: 1,
      },
    };
  },

  computed: {
    sortedHistory() {
      return [...this.weightHistory].sort(this.sortMethods(this.currentSort));
    },
  },

  methods: {
    formatDate(timestamp: string) {
      return DateTime.fromISO(timestamp).toLocaleString(DateTime.DATE_SHORT);
    },
    createWeight() {
      const url = `${API_URL}${this.$route.params.id}/weights/add`;
      delete this.newWeight._id;

      const authStore = useAuthStore();
      const requestOptions = {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-access-token': authStore.user.token 
         },
        body: JSON.stringify(this.newWeight),
      };
      this.showAlert = false;

      fetch(url, requestOptions)
        .then(async (response) => {
          const data = await response.json();

          if (!response.ok) {
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          } else {
            this.$emit('weightAdded');
            this.alertMsg = successMsg;
            this.alertIsError = false;
            this.showAlert = true;

            this.newWeight = { ...defaultWeigh };
            setTimeout(() => {
              this.showAlert = false;
            }, 9000);
          }
        })
        .catch((error) => {
          console.error(errorMsg, error);
          this.alertMsg = errorMsg;
          this.alertIsError = true;
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
};
</script>

<template>
  <v-container fluid>
    <v-card class="ma-3 pa-6">
      <v-card
        v-if="weightHistory.length"
        class="chart-wrap"
      >
        <v-row>
          <v-col>
            <weight-line-chart :weight-history="weightHistory" />
          </v-col>
        </v-row>
      </v-card>
      <v-card class="new-weigh-card elevation-6 ma-3 pa-6">
        <v-card-title>Add New Weight Data</v-card-title>
        <v-row class="d-flex justify-center align-center">
          <v-col>
            <label>Weighing Date</label>
            <div class="pb-22">
              <Datepicker
                v-model="newWeight.weighDate"
                model-type="yyyy-MM-dd"
                :enable-time-picker="false"
                dark
              />
            </div>
          </v-col>
          <v-col>
            <label>Weight Amount</label>
            <v-text-field
              v-model="newWeight.weighAmt"
              type="number"
            />
          </v-col>
          <v-col>
            <label>Weight Units</label>
            <v-select
              v-model="newWeight.weighUnits"
              :items="WeighUnits"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea
              v-model="newWeight.weighComments"
              label="Comments"
              rows="3"
            />
          </v-col>
        </v-row>
        <div
          class="weight-btn-div d-flex justify-space-around align-center flex-column flex-md-row fill-height"
        >
          <v-btn
            class="weight-btn elevation-9"
            size="x-large"
            @click="createWeight"
          >
            Add New Weight Data
          </v-btn>
        </div>
        <div>
          <v-alert
            v-model="showAlert"
            :type="alertIsError ? 'error': 'success'"
            variant="tonal"
            closable
            close-label="Close Alert"
          >
            {{
              alertMsg
            }}
          </v-alert>
        </div>
      </v-card>
      <v-card class="tbl-wrap weight-tbl pa-3">
        <v-card-title>Weight History</v-card-title>
        <v-table
          class="data-tbl"
          fixed-header
        >
          <thead>
            <tr>
              <th class="tbl-head text-left">
                <a
                  href="#"
                  @click.prevent="$event => sort('weighDate', 'date')"
                >Date</a>
              </th>
              <th class="tbl-head text-left">
                <a
                  href="#"
                  @click.prevent="$event => sort('weighAmt', 'number')"
                >Weight</a>
              </th>
              <th class="tbl-head text-left">
                Weight Units
              </th>
              <th class="tbl-head text-left">
                Comments
              </th>
              <th class="tbl-head text-left" />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="weight in sortedHistory"
              :key="weight._id"
            >
              <td>{{ formatDate(weight.weighDate) }}</td>
              <td>{{ weight.weighAmt }}</td>
              <td>{{ weight.weighUnits }}</td>
              <td>{{ weight.weighComments }}</td>
              <td>
                <edit-weight-modal
                  @weight-edited="$event => $emit('weightAdded')"
                  :_id="weight._id? weight._id : '' "
                  :weigh-date="weight.weighDate"
                  :weigh-amt="weight.weighAmt"
                  :weigh-units="weight.weighUnits"
                  :weigh-comments="weight.weighComments? weight.weighComments : '' "
                />
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-card>
  </v-container>
</template>

<style lang="css" scoped>
.chart-wrap {
  margin:auto;
}
.chart-card {
  height: 700px;
  width: 1800px;
  max-width: 1500px;
  overflow-x: scroll;
  margin: 3px auto;
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
</style>
