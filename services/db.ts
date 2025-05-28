import * as SQLite from 'expo-sqlite';

import { Instrument } from '@/model/types';

import {
  ADD_INSTRUMENT_QUERY,
  CREATE_TABLE_QUERY,
  DELETE_INSTRUMENT_QUERY,
  GET_DATA_QUERY,
  GET_INSTRUMENT_QUERY,
  UPDATE_INSTRUMENT_QUERY,
} from './queries';

const db = SQLite.openDatabaseSync('stringLife', {
  useNewConnection: true,
});

export const createTable = async () => {
  await db.execAsync(CREATE_TABLE_QUERY);
};

export const getAllInstruments = async (): Promise<Instrument[]> => {
  return await db.getAllAsync(GET_DATA_QUERY);
};

export const getInstrument = async (id: string): Promise<Instrument | null> => {
  return await db.getFirstAsync(GET_INSTRUMENT_QUERY, [id]);
};

export const deleteInstrumentById = async (id: number) => {
  return await db.runAsync(DELETE_INSTRUMENT_QUERY, id);
};

export const addInstrument = async (
  name: string,
  type: string | null,
  timestamp: number | null,
  progress: number
) => {
  return await db.runAsync(
    ADD_INSTRUMENT_QUERY,
    name,
    type,
    timestamp,
    progress
  );
};

export const updateInstrument = async (newProgress: number, id: string) => {
  return await db.runAsync(UPDATE_INSTRUMENT_QUERY, newProgress, id);
};

export default db;
