import { useMemo } from 'react';

export const HOURS_IN_MS = 60 * 60 * 1000;
export const MINUTES_IN_MS = 60 * 1000;

export type InstrumentStats = {
  daysSince: number;
  totalMinutes: number;
  hours: number;
  minutes: number;
  totalHours: number;
};

export function useInstrumentTable(
  progress: number,
  replacementDate: Date | null | undefined
): InstrumentStats {
  const daysSinceReplacement = replacementDate
    ? Math.max(
        0,
        Math.floor(
          (Date.now() - replacementDate.getTime()) / (24 * HOURS_IN_MS)
        )
      )
    : 0;

  return useMemo<InstrumentStats>(() => {
    const safeProgress = Math.max(progress || 0, 0);
    const totalMinutes = Math.floor(safeProgress / MINUTES_IN_MS);
    const totalHours = safeProgress / HOURS_IN_MS;
    const hours = Math.floor(safeProgress / HOURS_IN_MS);
    const minutes = Math.floor((safeProgress % HOURS_IN_MS) / MINUTES_IN_MS);

    return {
      daysSince: daysSinceReplacement,
      totalMinutes,
      hours,
      minutes,
      totalHours:
        Number.isFinite(totalHours) && totalHours >= 0 ? totalHours : 0,
    };
  }, [daysSinceReplacement, progress]);
}
