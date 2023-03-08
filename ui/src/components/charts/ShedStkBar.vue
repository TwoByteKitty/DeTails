<script lang="ts">
import type { IShed } from '@/shared/IShed';
import 'chartjs-adapter-luxon';
import 'chartjs-plugin-style';
import { DateTime } from 'luxon';
import type { PropType } from 'vue';
import { Bar } from 'vue-chartjs';

const getShedCycleStartDates = (shedHistory: Array<IShed>) =>
  shedHistory.map(({ pinkBelly }) => DateTime.fromISO(pinkBelly).toLocaleString(DateTime.DATE_FULL));

const getShedPhaseDuration = (shedHistory: Array<IShed>, phase: string): Array<number> => {
  let durations = new Array<number>();
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
  return durations;
};

const getXAxisMinMax = (shedHistory: Array<IShed>) => {
  if (!shedHistory.length) {
    return { duration: 0 };
  }
  const dates = shedHistory.map(({ pinkBelly }) => DateTime.fromISO(pinkBelly));

  const firstDate = dates[0].minus({ months: 1 });
  const lastDate = dates[dates.length - 1].plus({ months: 1 });
  const duration = lastDate.diff(firstDate, ['months']);

  return {
    duration: Math.ceil(duration.months),
  };
};

export default {
  name: 'ShedStkBar',
  components: { Bar },
  props: {
    shedHistory: { type: Array as PropType<Array<IShed>>, required: true },
  },
  data() {
    return {
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
    chartBoxWidth() {
      const widthObj = { width: '1500px' };
      const totalLabels = getXAxisMinMax(this.shedHistory).duration;
      if (totalLabels > 5) {
        widthObj.width = `${1500 + (totalLabels - 5) * 42}px`;
      }
      return widthObj;
    },
  },
  watch: {},
};
</script>

<template>
  <div class="chart-box ma-3 pa-6" :style="chartBoxWidth">
    <Bar
      id="shed-chart"
      :options="chartOptions"
      :data="chartData"
    />
  </div>
</template>
