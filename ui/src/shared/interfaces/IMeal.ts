export interface IMeal {
    _id?: string;
    feedDate: string;
    preyNo: number;
    preyType: Array<string>;
    dOD: string;
    mealWeight: number;
    eaten: string;
    feedComments?: string;
  }
  