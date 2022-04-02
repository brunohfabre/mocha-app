import { format, isValid } from 'date-fns';
import { ipcMain } from 'electron';

import { connections } from '../connections';

interface ShowDatabasesData {
  connectionId: string;
  query: string;
}

type FieldType = {
  name: string;
};

interface QueryResponse {
  count: number;
  fields: FieldType[];
  rows: { [key: string]: string }[];
}

function processResult(
  fields: { name: string }[],
  rows: { [key: string]: string }[]
) {
  return {
    count: rows.length,
    fields: fields.map((field: { name: string }) => ({
      name: field.name,
    })),
    rows: rows.map((row: { [key: string]: string }) => {
      const newRow = {} as {
        [key: string]: string;
      };

      Object.keys(row).forEach((key) => {
        const item = row[key];

        if (item === null || item === undefined) {
          newRow[key] = String(item);
        } else if (typeof item === 'number') {
          newRow[key] = item;
        } else if (typeof item === 'object' && isValid(new Date(item))) {
          newRow[key] = format(new Date(item), 'yyyy-MM-dd HH:mm:ss.SSS');
        } else {
          newRow[key] = String(item);
        }
      });

      return newRow;
    }),
  };
}

export function runQuery(): void {
  ipcMain.handle(
    'run-query',
    async (_, data: ShowDatabasesData): Promise<QueryResponse> => {
      const { connectionId, query } = data;

      const connection = connections[connectionId];

      if (!connection) {
        throw new Error('Connection not found.');
      }

      let result = {} as {
        count: number;
        fields: { name: string }[];
        rows: { [key: string]: string }[];
      };

      if (connection.info.type === 'POSTGRES') {
        const { fields, rows } = await connection.connection.raw(query);

        result = processResult(fields, rows);
      }

      if (
        connection.info.type === 'MYSQL' ||
        connection.info.type === 'MARIADB'
      ) {
        const [rows, fields] = await connection.connection.raw(query);

        result = processResult(fields, rows);
      }

      return result;
    }
  );
}
