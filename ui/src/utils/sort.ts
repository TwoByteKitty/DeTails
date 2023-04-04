import { DateTime } from "luxon";

export interface ITableSort {
   key: string;
   type: string;
   order: number;
}

export const getSortMethods = <T>(currentSort: ITableSort): ((a: T, b: T) => number) | undefined => {
   const { key, type, order } = currentSort;
   switch (type) {
      case 'string': {
         console.log('Sorting by string');
         console.log(currentSort);
         return order === 1
            ? (a: T, b: T) =>
               b[key as keyof T] > a[key as keyof T]
                  ? -1
                  : a[key as keyof T] > b[key as keyof T]
                     ? 1
                     : 0
            : (a: T, b: T) =>
               a[key as keyof T] > b[key as keyof T]
                  ? -1
                  : b[key as keyof T] > a[key as keyof T]
                     ? 1
                     : 0;
      }
      case 'number': {
         console.log('Sorting by number');
         console.log(currentSort);
         return order === 1
            ? (a: T, b: T) => Number(b[key as keyof T]) - Number(a[key as keyof T])
            : (a: T, b: T) => Number(a[key as keyof T]) - Number(b[key as keyof T]);
      }
      case 'date': {
         console.log('Sorting by date');
         console.log(currentSort);
         if (order === 1) {
            return (a: T, b: T) =>
               DateTime.fromISO(b[key as keyof T] as string) < DateTime.fromISO(a[key as keyof T] as string)
                  ? 1
                  : DateTime.fromISO(b[key as keyof T] as string) >
                     DateTime.fromISO(a[key as keyof T] as string)
                     ? -1
                     : 0;
         } else {
            return (a: T, b: T) =>
               DateTime.fromISO(a[key as keyof T] as string) < DateTime.fromISO(b[key as keyof T] as string)
                  ? 1
                  : DateTime.fromISO(a[key as keyof T] as string) >
                     DateTime.fromISO(b[key as keyof T] as string)
                     ? -1
                     : 0;
         }
      }
   }
}
