<script lang="ts">
import { errorHandler } from '@/shared/errorHandler';
import type { IShed } from '@/shared/interfaces/IShed';
import { PET_API, POST } from '@/utils/fetch';
import { getSortMethods } from '@/utils/sort';
import ShedStkBar from '../charts/ShedStkBar.vue';
import EditShedModal from '../modals/EditShedModal.vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import 'chartjs-adapter-luxon';
import 'chartjs-plugin-style';
import { DateTime } from 'luxon';
import type { PropType } from 'vue';
import { ref } from 'vue';

const defaultShed: IShed = {
  _id: '',
  pinkBelly: '',
  blueEyes: '',
  clearEyes: '',
  shedSkin: '',
  entire: 'Not Entire',
  shedComments: '',
};
const errorMsg = 'You really screwed up this time...';
const successMsg = 'Success! New shed data saved.';

export default {
  name: 'ShedTab',
  components: { Datepicker, ShedStkBar, EditShedModal },
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
      return [...this.shedHistory].sort(getSortMethods<IShed>(this.currentSort));
    },
  },
  methods: {
    formatDate(timestamp: string) {
      return DateTime.fromISO(timestamp).toLocaleString(DateTime.DATE_SHORT);
    },
    createSuccess(){
      this.$emit('shedAdded');
      this.alertMsg = successMsg;
      this.alertIsError = false;
      this.showAlert = true;
      this.newShed = { ...defaultShed };
        setTimeout(() => {
          this.showAlert = false;
        }, 9000);
    },
    async createShed() {
      delete this.newShed._id;
      this.showAlert = false;
      try{
        const data = await POST(`${PET_API}/${this.$route.query.id}/sheds/add`, this.newShed);
        console.log(data);
        this.createSuccess();
      }catch(error){
        errorHandler(error, errorMsg, this);
        }
    },
    sort(sortKey: string, sortType: string) {
      this.currentSort.key = sortKey;
      this.currentSort.type = sortType;
      this.currentSort.order *= -1;
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
                <th class="tbl-head text-left" />
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="shed in sortedHistory"
                :key="shed._id"
              >
                <td>{{ formatDate(shed.pinkBelly) }}</td>
                <td>{{ formatDate(shed.blueEyes) }}</td>
                <td>{{ formatDate(shed.clearEyes) }}</td>
                <td>{{ formatDate(shed.shedSkin) }}</td>
                <td>{{ shed.entire === 'Not Entire' ? 'N' : 'Y' }}</td>
                <td>{{ shed.shedComments }}</td>
                <td>
                  <edit-shed-modal
                    @shed-edited="$event => $emit('shedAdded')"
                    :_id="shed._id? shed._id : '' "
                    :pink-belly="shed.pinkBelly"
                    :blue-eyes="shed.blueEyes"
                    :clear-eyes="shed.clearEyes"
                    :shed-skin="shed.shedSkin"
                    :entire="shed.entire"
                    :shed-comments="shed.shedComments? shed.shedComments : '' "
                  />
                </td>
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
