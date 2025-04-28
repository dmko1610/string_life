export const CREATE_TABLE_QUERY = `
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS stringLife (
  id INTEGER PRIMARY KEY NOT NULL, 
  name TEXT NOT NULL, 
  type TEXT NOT NULL, 
  replacement_date INTEGER, 
  progress INTEGER);
  `;

export const GET_DATA_QUERY = 'SELECT * FROM stringLife';
export const GET_INSTRUMENT_QUERY = 'SELECT * FROM stringLife WHERE id=?';

export const DELETE_INSTRUMENT_QUERY = 'DELETE FROM stringLife WHERE id = ?';

export const ADD_INSTRUMENT_QUERY = `
INSERT INTO stringLife (
name, type, replacement_date, progress) 
VALUES (?, ?, ?, ?)`;

export const UPDATE_INSTRUMENT_QUERY =
  'UPDATE stringLife SET progress= ? WHERE id=?';
