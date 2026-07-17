import { Instrument } from '@/model/types';

import { ApiInstrument } from './instrumentsApi';
import { ApiSession } from './sessionsApi';

export function apiInstrumentTypeToUiType(type: string) {
  switch (type.trim().toUpperCase()) {
    case 'ELECTRIC':
    case 'ELECTRO':
      return 'electro';
    case 'ACOUSTIC':
      return 'acoustic';
    case 'BASS':
      return 'bass';
    case 'UKULELE':
      return 'ukulele';
    default:
      return 'acoustic';
  }
}

export function uiTypeToApiInstrumentType(type: string) {
  switch (type) {
    case 'electro':
      return 'ELECTRIC';
    case 'acoustic':
      return 'ACOUSTIC';
    case 'bass':
      return 'BASS';
    case 'ukulele':
      return 'UKULELE';
    default:
      return 'ACOUSTIC';
  }
}

export function mapApiInstrumentToInstrument(
  apiInstrument: ApiInstrument,
  progress = 0
): Instrument {
  return {
    id: apiInstrument.id,
    name: apiInstrument.name,
    type: apiInstrumentTypeToUiType(apiInstrument.type),
    replacement_date: apiInstrument.lastStringChangeDate
      ? new Date(apiInstrument.lastStringChangeDate).getTime()
      : null,
    progress,
  };
}

export function getSessionsProgress(sessions: ApiSession[]) {
  return sessions.reduce((total, session) => {
    if (!session.endTime) return total;

    return (
      total +
      (new Date(session.endTime).getTime() -
        new Date(session.startTime).getTime())
    );
  }, 0);
}

export function timestampToApiDate(timestamp: number | null) {
  if (!timestamp) return null;

  return new Date(timestamp).toISOString().slice(0, 10);
}

export function dateToApiDate(date: Date | null) {
  if (!date) return null;

  return date.toISOString().slice(0, 10);
}
