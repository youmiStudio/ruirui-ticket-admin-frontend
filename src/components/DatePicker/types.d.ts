export type DatePickerItem = {
  id?: number | string;
  label: string;
  type: 'text' | 'date';
  pickDate?:string;
  default?: boolean;
};
