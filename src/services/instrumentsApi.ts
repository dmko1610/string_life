import { fetchJson } from './apiClient';

export type ApiInstrument = {
  id: string;
  name: string;
  type: string;
  stringCount: number;
  lastStringChangeDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: number;
};

export function getApiInstruments() {
  return fetchJson<ApiInstrument[]>('/instruments');
}

export function getApiInstrument(id: string) {
  return fetchJson<ApiInstrument>(`/instruments/${id}`);
}
