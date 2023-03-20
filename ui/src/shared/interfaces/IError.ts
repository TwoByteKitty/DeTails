export type ErrorTypes = 'AUTH'

export interface IError{
   message: string;
   type: ErrorTypes;
}
