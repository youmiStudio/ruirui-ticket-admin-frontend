export type DatePickerItem = {
  id?: number | string;
  label: string;
  type: 'text' | 'date';
  disabledDate?:Function,
  pickDate?:Array<string>;
  default?: boolean;
};
