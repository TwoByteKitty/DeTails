<script lang="ts">
import type { IShed } from '@/shared/interfaces/IShed';
import { useAuthStore } from '@/stores/auth.store';
import { getApiUrl } from '@/utils/fetch';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import 'chartjs-adapter-luxon';
import 'chartjs-plugin-style';
import { DateTime } from 'luxon';
import type { PropType } from 'vue';
import { ref } from 'vue';
import ShedStkBar from '../charts/ShedStkBar.vue';

const API_URL = `api/pets/`;
const defaultShed: IShed = {
  _id: '',
  pinkBelly: '',
  blueEyes: '',
  clearEyes: '',
  shedSkin: '',
  entire: 'Not Entire',
  shedComments: '',
};
const errorMsg = 'Well... you really screwed up this time...';
const successMsg = "I'm a success alert! Congratulations!";

export default {
  name: 'ShedTab',
  components: { Datepicker, ShedStkBar },
  emits: [ 'shedAdded' ],
  props: {
    shedHistory: { type: Array as PropType<Array<IShed>>, required: true },
  },
  data() {
    return {
      alertIsError: false,
      alertMsg: successMsg,
      showAlert: false,
      shedCycles: [],
      newShed: {
        ...defaultShed,
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
    sortedHistory() {
      return [...this.shedHistory].sort(this.sortMethods(this.currentSort));
    },
  },
  methods: {
    formatDate(timestamp: string) {
      return DateTime.fromISO(timestamp).toLocaleString(DateTime.DATE_SHORT);
    },

    createShed() {
      const url = `${API_URL}${this.$route.params.id}/sheds/add`;
      delete this.newShed._id;

      const authStore = useAuthStore();
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': authStore.user.token
        },
        body: JSON.stringify(this.newShed),
      };
      this.showAlert = false;

      fetch(getApiUrl(url), requestOptions)
        .then(async (response) => {
          const data = await response.json();

          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          } else {
            this.$emit('shedAdded');
            this.alertMsg = successMsg;
            this.alertIsError = false;
            this.showAlert = true;

            this.newShed = { ...defaultShed };
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
    sort(sortKey: string, sortType: string) {
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
          <v-card
            v-if="shedHistory.length"
            class="chart-wrap"
          >
            <v-row v-if="shedHistory.length">
              <v-col style="display:grid">
                <shed-stk-bar :shed-history="shedHistory" />
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <v-row>
      <v-col class="d-flex justify-center align-center" />
    </v-row>
    <v-row>
      <v-col>
        <v-card class="new-data-form elevation-6 ma-6 pa-6">
          <v-card-title>Add New Shed Cycle Data</v-card-title>
          <v-row class="d-flex justify-center align-center">
            <v-col>
              <label>Pink Belly</label>
              <Datepicker
                v-model="newShed.pinkBelly"
                model-type="yyyy-MM-dd"
                :enable-time-picker="false"
                dark
              />
            </v-col>
            <v-col>
              <label>Blue Eyes</label>
              <Datepicker
                v-model="newShed.blueEyes"
                model-type="yyyy-MM-dd"
                :enable-time-picker="false"
                dark
              />
            </v-col>
            <v-col>
              <label>Eyes Cleared</label>
              <Datepicker
                v-model="newShed.clearEyes"
                model-type="yyyy-MM-dd"
                :enable-time-picker="false"
                dark
              />
            </v-col>
            <v-col>
              <label>Skin Shed</label>
              <Datepicker
                v-model="newShed.shedSkin"
                model-type="yyyy-MM-dd"
                :enable-time-picker="false"
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
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea
                v-model="newShed.shedComments"
                label="Comments"
                variant="outlined"
              />
            </v-col>
          </v-row>
          <div class="shed-btn-div d-flex justify-space-around align-center flex-column flex-md-row fill-height">
            <v-btn
              class="shed-btn elevation-9"
              size="x-large"
              @click="createShed"
            >
              Add New Shed Cycle Data
            </v-btn>
          </div>
          <div>
            <v-alert
              v-model="showAlert"
              :type="alertIsError ? 'error' : 'success'"
              variant="tonal"
              closable
              close-label="Close Alert"
            >
              {{ alertMsg }}
            </v-alert>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="tbl-wrap shed-tbl">
          <v-card-title>Shed History</v-card-title>
          <v-table
            class="data-tbl"
            fixed-header
          >
            <thead>
              <tr>
                <th class="tbl-head text-left">
                  <a
                    href="#"
                    @click.prevent="$event => sort('pinkBelly', 'date')"
                  >Pink Belly</a>
                </th>
                <th class="tbl-head text-left">
                  <a
                    href="#"
                    @click.prevent="$event => sort('blueEyes', 'date')"
                  >Blue Eyes</a>
                </th>
                <th class="tbl-head text-left">
                  <a
                    href="#"
                    @click.prevent="$event => sort('clearEyes', 'date')"
                  >Clear Eyes</a>
                </th>
                <th class="tbl-head text-left">
                  <a
                    href="#"
                    @click.prevent="$event => sort('shedSkin', 'date')"
                  >Skin Shed</a>
                </th>
                <th class="tbl-head text-left">
                  <a
                    href="#"
                    @click.prevent="$event => sort('entire', 'string')"
                  >Entire?</a>
                </th>
                <th class="tbl-head text-left">
                  Comments
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in (sortedHistory as Array<IShed>)"
                :key="item._id"
              >
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
.chart-wrap {
  margin:auto;
}
.shed-btn {
  background-color: var(--md-ref-palette-tertiary50);
  margin: 12px;
  width: 600px;
  height: 60px;
}

</style>
