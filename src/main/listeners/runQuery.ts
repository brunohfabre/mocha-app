import { ipcMain } from 'electron';
import postgresDataTypes from '../../renderer/assets/dataTypes/postgres.json';

import { connections } from '../connections';

interface ShowDatabasesData {
  connectionId: string;
  query: string;
}

type FieldType = {
  name: string;
  type: string;
};

interface QueryResponse {
  count: 0;
  fields: FieldType[];
  rows: { [key: string]: string }[];
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

      let result = {
        count: 0,
        fields: [],
        rows: [],
      };

      if (connection.info.type === 'POSTGRES') {
        const { fields, rows, rowCount } = await connection.connection.raw(
          query
        );

        result = {
          count: rowCount as number,
          fields: fields.map((field: any) => ({
            name: field.name,
            type: postgresDataTypes[field.dataTypeID] || 'unknow',
          })),
          rows,
        };
      }

      if (
        connection.info.type === 'MYSQL' ||
        connection.info.type === 'MARIADB'
      ) {
        const [rows, fields] = await connection.connection.raw(query);

        result = {
          count: rows.length,
          fields: fields.map((field: any) => ({
            name: field.name,
            type: field.type,
          })),
          rows,
        };
      }

      return result;
    }
  );
}
