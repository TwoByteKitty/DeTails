import type { IMeal } from "./IMeal";
import type { IPetImage } from "./IPetImage";
import type { IShed } from "./IShed";
import type { IWeight } from "./IWeight";

export interface IPet {
  name?: string;
  type?: string|null;
  species?: string;
  sex?: string;
  dateOfBirth?: string;
  description?: string;
  petImages?: Array<IPetImage>;
  mealSchedule?: Array<{}>;
  feedingHistory?: Array<IMeal>;
  shedHistory?: Array<IShed>;
  weightHistory?: Array<IWeight>;
  // vetHistory?: Array<IVet>;
  ownerId?: string;
}
