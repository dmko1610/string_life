import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'playStartTime';

export default function usePlayTimer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const startTimeRef = useRef<number | null>(null);

  const start = useCallback(async () => {
    const now = Date.now();
    startTimeRef.current = now;

    await AsyncStorage.setItem(STORAGE_KEY, String(now));
    setIsPlaying(true);
  }, []);

  const stop = useCallback(async (): Promise<number> => {
    let elapsed = 0;

    const startTime =
      startTimeRef.current ?? Number(await AsyncStorage.getItem(STORAGE_KEY));

    if (startTime) {
      elapsed = Date.now() - startTime;
    }

    startTimeRef.current = null;
    setIsPlaying(false);

    await AsyncStorage.removeItem(STORAGE_KEY);
    return elapsed;
  }, []);

  const checkResume = useCallback(async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);

    if (stored) {
      startTimeRef.current = Number(stored);
      setIsPlaying(true);
    }
  }, []);

  useEffect(() => {
    checkResume();
  }, [checkResume]);

  return {
    isPlaying,
    start,
    stop,
  };
}
