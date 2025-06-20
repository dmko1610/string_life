export type Instrument = {
  id: string;
  name: string;
  type: string;
  replacement_date?: number | null;
  progress?: number | null;
};
