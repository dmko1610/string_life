export type Instrument = {
  id: number;
  name: string;
  type: string;
  replacement_date?: number | null;
  progress?: number | null;
};
