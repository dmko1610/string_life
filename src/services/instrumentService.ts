import { getApiInstrument, getApiInstruments } from './instrumentsApi';
import { getSessionsProgress, mapApiInstrumentToInstrument } from './mappers';
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
