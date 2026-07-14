import {
  createApiInstrument,
  deleteApiInstrument,
  getApiInstrument,
  getApiInstruments,
  updateApiInstrument,
} from './instrumentsApi';
import {
  getSessionsProgress,
  mapApiInstrumentToInstrument,
  timestampToApiDate,
} from './mappers';
import { getApiSessions } from './sessionsApi';

export async function getAllInstruments() {
  const instruments = await getApiInstruments();

  return Promise.all(
    instruments.map(async (instrument) => {
      const sessions = await getApiSessions(instrument.id);
      const progress = getSessionsProgress(sessions);

      return mapApiInstrumentToInstrument(instrument, progress);
    })
  );
}

export async function getInstrument(id: string) {
  const instrument = await getApiInstrument(id);
  const sessions = await getApiSessions(id);
  const progress = getSessionsProgress(sessions);

  return mapApiInstrumentToInstrument(instrument, progress);
}

export async function addInstrument(
  name: string,
  type: string | null,
  timestamp: number | null
) {
  await createApiInstrument({
    name,
    type: type ?? 'acoustic',
    stringCount: 6,
    lastStringChangeDate: timestampToApiDate(timestamp),
    notes: null,
  });
}

export async function updateInstrument(
  id: string,
  _newProgress: number,
  newDate: number
) {
  const current = await getApiInstrument(id);

  await updateApiInstrument(id, {
    name: current.name,
    type: current.type,
    stringCount: current.stringCount,
    lastStringChangeDate: timestampToApiDate(newDate),
    notes: current.notes,
  });
}

export async function deleteInstrumentById(id: string) {
  await deleteApiInstrument(id);
}
