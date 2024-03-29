<script lang="ts">
import { errorHandler } from '@/shared/errorHandler';
import type { IMeal } from '@/shared/interfaces/IMeal';
import { useAuthStore } from '@/stores/auth.store';
import { DegreeOfDead, PreyType } from '@/shared/SelectLists.js';
import type { IMealSchedule } from '@/utils/feedingSchedule';
import { generateFeedingSchedule } from '@/utils/feedingSchedule';
import { PET_API, POST, PUT } from '@/utils/fetch';
import { getSortMethods } from '@/utils/sort';
import EditFeedingModal from '../modals/EditFeedingModal.vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { DateTime } from 'luxon';
import { Calendar } from 'v-calendar';
import type { PropType } from 'vue';




const defaultMeal: IMeal = {
  _id: '',
  feedDate: '',
  preyNo: 0,
  preyType: [],
  dOD: '',
  mealWeight: 0,
  eaten: 'Not Eaten',
  feedComments: '',
};
const errorMsg = 'You really screwed up this time...';
const successMsg = 'Success! New meal data saved.';

export default {
  name: 'FeedingTab',
  components: { Calendar, Datepicker, EditFeedingModal },
  emits: [ 'feedingAdded' ],
  props: {
    feedingHistory: { type: Array as PropType<Array<IMeal>>, required: true },
    mealSchedule: { type: Array as PropType<Array<IMealSchedule>>, required: true },
  },

  data() {
    return {
      masks: {
        weekdays: 'WWW',
      },
      DegreeOfDead,
      PreyType,
      alertIsError: false,
      alertMsg: successMsg,
      showAlert: false,
      freqSlider: [7, 21],
      sizeSlider: [60, 120],
      newMeal: { ...defaultMeal },
      currentSort: {
        key: 'feedDate',
        type: 'date',
        order: 1,
      },
    };
  },

computed:{
  feedingScheduleDisplay(){
      return this.mapFeedingScheduleToCalendar(this.mealSchedule)
  },
  sortedHistory() {
     return [...this.feedingHistory].sort(getSortMethods<IMeal>(this.currentSort));
  },
},
  methods: {
    formatDate(timestamp: string) {
      return DateTime.fromISO(timestamp).toLocaleString(DateTime.DATE_SHORT);
    },
    createSuccess(){
      this.$emit('feedingAdded');
      this.alertMsg = successMsg;
      this.alertIsError = false;
      this.showAlert = true;
      this.newMeal = { ...defaultMeal };
        setTimeout(() => {
          this.showAlert = false;
        }, 9000);
    },
    async createMeal() {
      delete this.newMeal._id;
      this.showAlert = false;
      try{
        await POST(`${PET_API}/${this.$route.query.id}/feedings/add`, this.newMeal);
        this.createSuccess();
      }catch(error){
        errorHandler(error, errorMsg, this);
      }
    },
    mapFeedingScheduleToCalendar(schedule: Array<IMealSchedule>){
      return schedule && schedule.map(({ weight, date }: IMealSchedule, index) => ({
        key: index + 1,
        customData: {
          weight,
          class:'schedule-weight',
        },
        dates: new Date(date),
        bar: 'purple'
      }));
    },
    createFeedingSchedule() {
      const schedule: Array<IMealSchedule> = generateFeedingSchedule(this.freqSlider, this.sizeSlider);
      console.log(schedule);
      this.editFeedingSchedule(schedule);
    },
    async editFeedingSchedule(mealSchedule: Array<IMealSchedule>) {
      try{
        const data = await PUT(`${PET_API}/${this.$route.query.id}/feeding-schedule`, { _id: this.$route.query.id, mealSchedule });
        console.log(data);
        this.$emit('feedingAdded');
      }catch(error: any){
        const { logout } = useAuthStore();
        if(error.message.split(':')[0]=== 'AUTH'){
          logout();
        }
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
    <v-row>
      <v-col>
        <v-card class="mt-6">
          <div class="cale-wrap text-center section d-flex align-center flex-column flex-md-row fill-height">
            <div class="fuck-you-thats-why">
              <calendar
                class="custom-calendar max-w-full"
                :masks="masks"
                :attributes="feedingScheduleDisplay"
                disable-page-swipe
                is-expanded
                is-dark
                color="indigo"
              >
                <template #day-content="{ day, attributes }">
                  <div class="cale-day">
                    <span class="day-label text-sm text-gray-900">{{ day.day }}</span>
                    <div class="flex-grow overflow-y-auto overflow-x-auto">
                      <span
                        v-for="attr in attributes"
                        :key="attr.key"
                        class="meal-marker"
                        :class="attr.customData.class"
                      >
                        <v-icon>fa:fas fa-light fa-mouse-field</v-icon>
                        ~{{ attr.customData.weight }} grams
                      </span>
                    </div>
                  </div>
                </template>
              </calendar>
            </div>
          </div>
          <v-row>
            <v-col>
              <v-card class="guide-sliders elevation-6">
                <v-row>
                  <v-col class="freq-col slider-col d-flex">
                    <label class="slider-label"> Meal Frequency </label>
                    <v-range-slider
                      class="slider freq-slider"
                      v-model="freqSlider"
                      :max="60"
                      :min="5"
                      :step="1"
                      strict
                    >
                      <template #prepend>
                        <v-text-field
                          :model-value="freqSlider[0]"
                          hide-details
                          single-line
                          type="number"
                          variant="outlined"
                          style="width: 75px"
                        />
                      </template>
                      <template #append>
                        <v-text-field
                          :model-value="freqSlider[1]"
                          hide-details
                          single-line
                          type="number"
                          variant="outlined"
                          style="width: 75px"
                        />
                      </template>
                    </v-range-slider>
                  </v-col>
                  <v-col class="size-col slider-col d-flex">
                    <label class="slider-label"> Meal Size </label>
                    <v-range-slider
                      class="slider size-slider"
                      v-model="sizeSlider"
                      :max="500"
                      :min="3"
                      :step="1"
                      strict
                    >
                      <template #prepend>
                        <v-text-field
                          :model-value="sizeSlider[0]"
                          hide-details
                          single-line
                          type="number"
                          variant="outlined"
                          style="width: 75px"
                        />
                      </template>
                      <template #append>
                        <v-text-field
                          :model-value="sizeSlider[1]"
                          hide-details
                          single-line
                          type="number"
                          variant="outlined"
                          style="width: 75px"
                        />
                      </template>
                    </v-range-slider>
                  </v-col>
                </v-row>
                <v-divider />
                <div class="guide-btn-div d-flex justify-space-around align-center flex-column flex-md-row fill-height">
                  <v-btn
                    class="guide-btn elevation-9"
                    size="x-large"
                    @click="createFeedingSchedule"
                  >
                    Create Feeding Guide!
                  </v-btn>
                </div>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col />
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="new-data-form elevation-6 ma-9 pa-9">
          <v-card-title>Enter New Meal Data</v-card-title>
          <v-divider />
          <v-row class="mt-6">
            <v-col>
              <label>Date of Feeding</label>
              <Datepicker
                v-model="newMeal.feedDate"
                :enable-time-picker="false"
                model-type="yyyy-MM-dd"
                dark
              />
            </v-col>
            <v-col>
              <label>No. of Prey Items</label>
              <v-text-field
                v-model="newMeal.preyNo"
                type="number"
                variant="outlined"
              />
            </v-col>
            <v-col>
              <label>Type of Prey</label>
              <v-select
                v-model="newMeal.preyType"
                :items="PreyType"
                multiple
                variant="underlined"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <label>Degree of Deadness</label>
              <v-select
                v-model="newMeal.dOD"
                :items="DegreeOfDead"
                variant="underlined"
              />
            </v-col>
            <v-col class="weight-col">
              <label>Aproximate Total Weight(in grams)</label>
              <v-text-field
                v-model="newMeal.mealWeight"
                type="number"
                variant="outlined"
                suffix="g"
              />
            </v-col>
            <v-col>
              <div class="eaten-btn-div d-flex justify-space-around align-center flex-column flex-md-row fill-height">
                <v-switch
                  v-model="newMeal.eaten"
                  hide-details
                  true-value="Eaten"
                  false-value="Not Eaten"
                  :label="`${newMeal.eaten}`"
                  inset
                />
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea
                v-model="newMeal.feedComments"
                clearable
                label="Comments"
              />
            </v-col>
          </v-row>
          <div class="meal-btn-div d-flex justify-space-around align-center flex-column flex-md-row fill-height">
            <v-btn
              class="meal-btn elevation-9"
              size="x-large"
              @click="createMeal"
            >
              Add New Meal Data
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
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="tbl-wrap meal-tbl">
          <v-card-title>Meal History</v-card-title>
          <v-divider />
          <v-table
            class="data-tbl"
            fixed-header
          >
            <thead>
              <tr>
                <th class="tbl-head text-left">
                  <a
                    href="#"
                    @click.prevent="$event => sort('feedDate', 'date')"
                  >Date</a>
                </th>
                <th class="tbl-head text-left">
                  <a
                    href="#"
                    @click.prevent="$event => sort('preyNo', 'number')"
                  >No. of Prey Items</a>
                </th>
                <th class="tbl-head text-left">
                  <a
                    href="#"
                    @click.prevent="$event => sort('preyType', 'string')"
                  >Type of Prey</a>
                </th>
                <th class="tbl-head text-left">
                  <a
                    href="#"
                    @click.prevent="$event => sort('dOD', 'string')"
                  >Degree of Deadness</a>
                </th>
                <th class="tbl-head text-left">
                  <a
                    href="#"
                    @click.prevent="$event => sort('mealWeight', 'number')"
                  >Apx Total Weight(g)</a>
                </th>
                <th class="tbl-head text-left">
                  <a
                    href="#"
                    @click.prevent="$event => sort('eaten', 'string')"
                  >Eaten?</a>
                </th>
                <th class="tbl-head text-left">
                  Comments
                </th>
                <th class="tbl-head text-left" />
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="feeding in sortedHistory"
                :key="feeding._id"
              >
                <td>{{ formatDate(feeding.feedDate) }}</td>
                <td>{{ feeding.preyNo }}</td>
                <td>{{ feeding.preyType.toString() }}</td>
                <td>{{ feeding.dOD }}</td>
                <td>{{ feeding.mealWeight }}</td>
                <td>{{ feeding.eaten === 'Not Eaten' ? 'N' : 'Y' }}</td>
                <td>{{ feeding.feedComments }}</td>
                <td>
                <edit-feeding-modal
                  @feeding-edited="$event => $emit('feedingAdded')"
                  :_id="feeding._id? feeding._id : '' "
                  :feed-date="feeding.feedDate"
                  :prey-no="feeding.preyNo"
                  :prey-type="feeding.preyType"
                  :d-o-d="feeding.dOD"
                  :meal-weight="feeding.mealWeight"
                  :eaten="feeding.eaten"
                  :feed-comments="feeding.feedComments? feeding.feedComments : '' "
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

<style lang="css">
.cale-wrap .fuck-you-thats-why {
  width: 900px;
  margin: auto;
  height: 750px;
}
.custom-calendar.vc-container{
  background-color: #322F37;
  border: 2px;
  border-style: outset;
  border-color: #625B71;
  box-shadow: 6px 3px 3px #1C1B1F;
}
.cale-day {
  width: 100px;
  height: 100px;
  margin: auto;
}
.vc-day{
  border: 1px;
  border-style: dotted;
  border-color: #4A4458;
}
.custom-calendar.vc-container .vc-header{
  padding: 20px;
}
.vc-arrows-container{
  padding: 20px;
}

  .custom-calendar.vc-container .schedule-weight{
    display: inline-block;
    font-size: 18px;
    padding: 3px;
  }

.guide-sliders {
  padding: 20px 20px 0px 20px;
  margin: 12px;
}
.slider-col {
  padding: 3px;
  margin: 3px;
  align-feedings: center;
  justify-feedings: center;
  flex-direction: column;
}
.slider-col .slider-label {
  width: 100%;
  text-align: center;
}
.slider-col .slider {
  width: 100%;
}
.guide-btn {
  background-color: var(--md-ref-palette-tertiary60);
  box-shadow: 9px 6px 3px #1C1B1F;
  margin: 12px;
  width: 900px;
  height: 60px;
  border: 2px;
  border-style: outset;
  border-color: #D29DAC;
}
.guide-btn-div {
  margin: 12px;
  padding: 21px;
}
.eaten-btn-div {
  margin-left: 60px;
  padding-left: 18px;
}
.meal-btn {
  background-color: var(--md-ref-palette-primary50);
  margin: 12px;
  width: 600px;
  height: 60px;
}

</style>
