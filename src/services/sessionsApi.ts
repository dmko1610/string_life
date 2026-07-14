import { fetchJson } from './apiClient';

export type ApiSession = {
  id: string;
  instrumentId: string;
  startTime: string;
  endTime: string | null;
  notes: string | null;
  createdAt: string;
};

export function getApiSessions(instrumentId: string) {
  return fetchJson<ApiSession[]>(`/sessions?instrumentId=${instrumentId}`);
}
