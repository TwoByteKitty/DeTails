import { DateTime } from 'luxon';

const SCHEDULE_LENGTH: number = 90;
const START_DATE: DateTime = DateTime.now();

export interface IMealSchedule {
  date: string;
  weight: number;
}

export const generateFeedingSchedule = (
  [freqLowerBound, freqUpperBound]: Array<number>,
  [weightLowerBound, weightUpperBound]: Array<number>
) => {
  const schedule: Array<IMealSchedule> = new Array();
  let date: DateTime = START_DATE;
  console.log(date.toLocaleString());

  for (let i = 1; i <= SCHEDULE_LENGTH; ) {
    const nextDate: number = Math.floor(Math.random() * (freqUpperBound - freqLowerBound) + freqLowerBound);
    const weight: number = Math.floor(Math.random() * (weightUpperBound - weightLowerBound) + weightLowerBound);

    date = date.plus({ days: nextDate });

    const feeding: IMealSchedule = { date: date.toLocaleString(), weight };

    schedule.push(feeding);
    i += nextDate;
  }
  return schedule;
};
