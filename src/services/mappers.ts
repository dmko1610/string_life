import { Instrument } from '@/model/types';

import { ApiInstrument } from './instrumentsApi';
import { ApiSession } from './sessionsApi';

export function mapApiInstrumentToInstrument(
  apiInstrument: ApiInstrument,
  progress = 0
): Instrument {
  return {
    id: apiInstrument.id,
    name: apiInstrument.name,
    type: apiInstrument.type,
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
