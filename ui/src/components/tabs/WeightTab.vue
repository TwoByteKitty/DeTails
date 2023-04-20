<script lang="ts">
import { errorHandler } from '@/shared/errorHandler';
import type { IWeight } from '@/shared/interfaces/IWeight';
import { WeighUnits } from '@/shared/SelectLists.js';
import { PET_API, POST } from '@/utils/fetch';
import { getSortMethods } from '@/utils/sort';
import WeightLineChart from '../charts/WeightLineChart.vue';
import EditWeightModal from '../modals/EditWeightModal.vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import 'chartjs-plugin-style';
import { DateTime } from 'luxon';
import { ref, type PropType } from 'vue';

const defaultWeigh: IWeight = {
  _id: '',
  weighDate: '',
  weighAmt: 0,
  weighUnits: '',
  weighComments: '',
};
const errorMsg = 'You really screwed up this time...';
const successMsg = 'Success! New weight data saved.';

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
  setup() {
    const date = ref(new Date());
    return {
      date,
    };
  },
  computed: {
    sortedHistory() {
      return [...this.weightHistory].sort(getSortMethods<IWeight>(this.currentSort));
    },
  },
  methods: {
    formatDate(timestamp: string) {
      return DateTime.fromISO(timestamp).toLocaleString(DateTime.DATE_SHORT);
    },
    createSuccess(){
      this.$emit('weightAdded');
      this.alertMsg = successMsg;
      this.alertIsError = false;
      this.showAlert = true;
      this.newWeight = { ...defaultWeigh };
        setTimeout(() => {
          this.showAlert = false;
        }, 9000);
    },
    async createWeight() {
      delete this.newWeight._id;
      this.showAlert = false;
      try{
        await POST(`${PET_API}/${this.$route.query.id}/weights/add`, this.newWeight);
        this.createSuccess();
      }catch(error){
        errorHandler(error, errorMsg, this);
      }
    },
    sort: function (sortKey: string, sortType: string) {
      this.currentSort.key = sortKey;
      this.currentSort.type = sortType;
      this.currentSort.order *= -1;
    }
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
        <v-row v-if="weightHistory.length">
          <v-col style="display:grid">
            <weight-line-chart :weight-history="weightHistory" />
          </v-col>
        </v-row>
      </v-card>
      <v-card class="new-data-form elevation-6 ma-3 pa-6">
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
      <v-card class="tbl-wrap weight-tbl">
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
