import * as SQLite from 'expo-sqlite';

import { CREATE_TABLE_QUERY, DELETE_INSTRUMENT_QUERY, GET_DATA_QUERY } from './queries';
import { Instrument } from '@/app';

const db = SQLite.openDatabaseSync('stringLife');

export const createTable = async () => {
  await db.execAsync(CREATE_TABLE_QUERY);
};

export const getAllInstruments = async (): Promise<Instrument[]> => {
  return await db.getAllAsync(GET_DATA_QUERY);
};

export const deleteInstrumentById = async (id: number) => {
  return await db.runAsync(DELETE_INSTRUMENT_QUERY, id);
}

export default db;
