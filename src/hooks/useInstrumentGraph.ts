import { useMemo } from 'react';

export const HOURS_IN_MS = 60 * 60 * 1000;
export const MINUTES_IN_MS = 60 * 1000;

export type GraphPoint = {
  day: number;
  hours: number;
};

export type InstrumentGraphData = {
  daysSince: number;
  points: GraphPoint[];
  maxDay: number;
  maxHours: number;
  totalHours: number;
};

export function useInstrumentGraph(
  progress: number,
  replacementDate: Date | null | undefined
): InstrumentGraphData {
  const daysSinceReplacement = replacementDate
    ? Math.max(
        0,
        Math.floor(
          (Date.now() - replacementDate.getTime()) / (24 * HOURS_IN_MS)
        )
      )
    : 0;

  return useMemo<InstrumentGraphData>(() => {
    const totalDays = Math.max(daysSinceReplacement, 1);
    const totalHours = progress / HOURS_IN_MS;

    if (!Number.isFinite(totalHours) || totalHours < 0) {
      return {
        daysSince: daysSinceReplacement,
        points: [
          { day: 0, hours: 0 },
          { day: totalDays, hours: 0 },
        ],
        maxDay: totalDays,
        maxHours: 1,
        totalHours: 0,
      };
    }

    if (daysSinceReplacement === 0) {
      return {
        daysSince: daysSinceReplacement,
        points: [
          { day: 0, hours: 0 },
          { day: 1, hours: totalHours },
        ],
        maxDay: 1,
        maxHours: Math.max(totalHours, 1),
        totalHours,
      };
    }

    const dailyIncrement = totalHours / totalDays;
    const generatedPoints: GraphPoint[] = Array.from(
      { length: totalDays + 1 },
      (_, idx) => ({
        day: idx,
        hours: dailyIncrement * idx,
      })
    );

    return {
      daysSince: daysSinceReplacement,
      points: generatedPoints,
      maxDay: totalDays,
      maxHours: Math.max(totalHours, 1),
      totalHours,
    };
  }, [daysSinceReplacement, progress]);
}
