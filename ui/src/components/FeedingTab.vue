<script setup lang="ts">
import { RouterLink } from 'vue-router';
import Datepicker from '@vuepic/vue-datepicker';
import { Calendar } from 'v-calendar';
import '@vuepic/vue-datepicker/dist/main.css';
</script>

<script lang="ts">
export default {
  data() {
    return {
      freqSlider: [20, 40],
      sizeSlider: [20, 40],
      ateMeal: 'Eaten',
      mealHistory: [
        {
          id: 1,
          feedingDate: '07-01-2022',
          preyAmt: '3',
          preyType: 'mouse',
          preyDead: 'F/T',
          totalWeight: 48,
          eaten: false,
          comments: 'blah blah blah',
        },
        {
          id: 2,
          feedingDate: '09-06-2022',
          preyAmt: '1',
          preyType: 'rat',
          preyDead: 'F/T',
          totalWeight: 102,
          eaten: true,
          comments: 'blah blah blah',
        },
        {
          id: 3,
          feedingDate: '12-03-2022',
          preyAmt: '1',
          preyType: 'mouse',
          preyDead: 'F/T',
          totalWeight: 72,
          eaten: true,
          comments: 'blah blah blah',
        },
      ],
    };
  },
  components: { Calendar, Datepicker },
  setup() {
    const date = ref(new Date());

    return {
      date,
    };
  },
};
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card class="mt-6">
          <v-card-title>Feeding Guide</v-card-title>
          <v-row>
            <v-col>
              <div class="cale-wrap d-flex align-center flex-column flex-md-row fill-height">
                <div class="fuck-you-thats-why">
                  <Calendar class="cale" is-dark is-expanded color="indigo"></Calendar>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-card class="guide-sliders elevation-6">
                <v-row>
                  <v-col class="freq-col slider-col d-flex">
                    <label class="slider-label"> Meal Frequency </label>
                    <v-range-slider class="slider freq-slider" v-model="freqSlider" :max="90" :min="1" :step="1" strict>
                      <template v-slot:prepend>
                        <v-text-field
                          :model-value="freqSlider[0]"
                          hide-details
                          single-line
                          type="number"
                          variant="outlined"
                          density="compact"
                          style="width: 70px"
                          @change="$set(freqSlider, 0, $event)"
                        ></v-text-field>
                      </template>
                      <template v-slot:append>
                        <v-text-field
                          :model-value="freqSlider[1]"
                          hide-details
                          single-line
                          type="number"
                          variant="outlined"
                          style="width: 70px"
                          density="compact"
                          @change="$set(freqSlider, 1, $event)"
                        ></v-text-field>
                      </template>
                    </v-range-slider>
                  </v-col>
                  <v-col class="size-col slider-col d-flex">
                    <label class="slider-label"> Meal Size </label>
                    <v-range-slider
                      class="slider size-slider"
                      v-model="sizeSlider"
                      :max="500"
                      :min="0"
                      :step="0.25"
                      strict
                    >
                      <template v-slot:prepend>
                        <v-text-field
                          :model-value="sizeSlider[0]"
                          hide-details
                          single-line
                          type="number"
                          variant="outlined"
                          density="compact"
                          style="width: 70px"
                          @change="$set(sizeSlider, 0, $event)"
                        ></v-text-field>
                      </template>
                      <template v-slot:append>
                        <v-text-field
                          :model-value="sizeSlider[1]"
                          hide-details
                          single-line
                          type="number"
                          variant="outlined"
                          style="width: 70px"
                          density="compact"
                          @change="$set(sizeSlider, 1, $event)"
                        ></v-text-field>
                      </template>
                    </v-range-slider>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <div class="guide-btn-div d-flex justify-space-around align-center flex-column flex-md-row fill-height">
                  <v-btn class="guide-btn elevation-9" size="x-large"> Create Feeding Guide! </v-btn>
                </div>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col> </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="elevation-6 ma-9 pa-9">
          <v-card-title>Enter New Meal Data</v-card-title>
          <v-divider></v-divider>
          <v-row class="mt-6">
            <v-col>
              <label>Date of Feeding</label>
              <Datepicker v-model="date" auto-apply dark />
            </v-col>
            <v-col>
              <label>No. of Prey Item(s)</label>
              <v-text-field type="number" variant="outlined"></v-text-field>
            </v-col>
            <v-col>
              <label>Type of Prey Item(s)</label>
              <v-select
                :items="['Mouse', 'Rat', 'ASF', 'Quail', 'Chick', 'Other']"
                multiple
                variant="underlined"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <label>Degree of Deadness</label>
              <v-select :items="['Live', 'Frozen/Thawed', 'Pre-Killed']" multiple variant="underlined"></v-select>
            </v-col>
            <v-col class="weight-col">
              <label>Aproximate Total Meal Weight(in grams)</label>
              <v-text-field type="number" variant="outlined" suffix="g"></v-text-field>
            </v-col>
            <v-col>
              <div class="eaten-btn-div d-flex justify-space-around align-center flex-column flex-md-row fill-height">
                <v-switch
                  v-model="ateMeal"
                  hide-details
                  true-value="Eaten"
                  false-value="Not Eaten"
                  :label="`${ateMeal}`"
                  inset
                ></v-switch>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea clearable label="Comments"></v-textarea>
            </v-col>
          </v-row>
          <div class="meal-btn-div d-flex justify-space-around align-center flex-column flex-md-row fill-height">
            <v-btn class="meal-btn elevation-9" size="x-large"> Add New Meal Data </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="meal-tbl-card">
          <v-card-title>Meal History</v-card-title>
          <v-divider></v-divider>
          <v-table fixed-header>
            <thead>
              <tr>
                <th class="tbl-head text-left">Record No.</th>
                <th class="tbl-head text-left">Date</th>
                <th class="tbl-head text-left">No. of Prey Item(s)</th>
                <th class="tbl-head text-left">Type of Prey</th>
                <th class="tbl-head text-left">Degree of Deadness</th>
                <th class="tbl-head text-left">Apx Total Weight(g)</th>
                <th class="tbl-head text-left">Eaten?</th>
                <th class="tbl-head text-left">Comments</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in mealHistory" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ item.feedingDate }}</td>
                <td>{{ item.preyAmt }}</td>
                <td>{{ item.preyType }}</td>
                <td>{{ item.preyDead }}</td>
                <td>{{ item.totalWeight }}</td>
                <td>{{ item.eaten }}</td>
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
.cale-wrap .fuck-you-thats-why {
  width: 600px;
  /* height: 600px; */
  margin: auto;
}
.cale-wrap .cale {
  background-color: var(--md-sys-color-surface-dark);
}
/* .cale {
  font-size: 24pt;
} */
.guide-sliders {
  padding: 20px 20px 0px 20px;
  margin: 12px;
}
.slider-col {
  padding: 3px;
  margin: 3px;
  align-items: center;
  justify-items: center;
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
  margin: 12px;
  width: 900px;
  height: 60px;
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
.meal-tbl-card {
  background-color: var(--md-sys-color-inverse-on-surface-dark);
  padding: 6px;
}
</style>
