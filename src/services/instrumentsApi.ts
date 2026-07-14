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

export type ApiInstrumentRequest = {
  name: string;
  type: string;
  stringCount: number;
  lastStringChangeDate: string | null;
  notes: string | null;
};

export function getApiInstruments() {
  return fetchJson<ApiInstrument[]>('/instruments');
}

export function getApiInstrument(id: string) {
  return fetchJson<ApiInstrument>(`/instruments/${id}`);
}

export function createApiInstrument(request: ApiInstrumentRequest) {
  return fetchJson<ApiInstrument>('/instruments', {
    method: 'POST',
    body: request,
  });
}

export function updateApiInstrument(id: string, request: ApiInstrumentRequest) {
  return fetchJson<ApiInstrument>(`/instruments/${id}`, {
    method: 'PUT',
    body: request,
  });
}

export function deleteApiInstrument(id: string) {
  return fetchJson<void>(`/instruments/${id}`, {
    method: 'DELETE',
  });
}
