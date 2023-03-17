<script lang="ts">
import type { IWeight } from '@/shared/IWeight';
import 'chartjs-plugin-style';
import { DateTime } from 'luxon';
import type { PropType } from 'vue';
import { Line } from 'vue-chartjs';

const DATE_FORMAT_STRING = 'yyyy-MM-dd';

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
  name: 'WeightLineChart',
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { Line },
  props: {
    weightHistory: { type: Array as PropType<Array<IWeight>>, required: true },
  },
  data() {
    return {
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
    };
  },
  methods: {
    formatDate(timestamp: string) {
      return DateTime.fromISO(timestamp).toLocaleString(DateTime.DATE_SHORT);
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
            data: this.weightHistory.map(({ weighAmt, weighDate }) => ({
              x: DateTime.fromISO(weighDate).toFormat(DATE_FORMAT_STRING),
              y: weighAmt,
            })),
          },
        ],
      };
    },
    chartBoxWidth() {
      console.log(getXAxisMinMax(this.weightHistory).duration);
      // This is the problem
      const widthObj = { width: '1500px' };
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
  <div class="chart-card">
    <div
      class="chart-box"
      :style="chartBoxWidth"
    >
      <Line
        id="my-chart-id"
        :options="chartOptions"
        :data="chartData"
      />
    </div>
  </div>
</template>

<style lang="css" scoped>
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

</style>
