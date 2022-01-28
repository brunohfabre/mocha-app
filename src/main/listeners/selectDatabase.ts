import { ipcMain } from 'electron';
import knex from 'knex';

import { connections } from '../connections';

interface SelectDatabaseData {
  connectionId: string;
  database: string;
}

export function selectDatabase(): void {
  ipcMain.handle(
    'select-database',
    async (_, data: SelectDatabaseData): Promise<void> => {
      const { connectionId, database } = data;

      const connection = connections[connectionId];

      if (!connection) {
        throw new Error('Connection not found.');
      }

      await connection.connection.destroy();

      const { type, host, port, user, password } = connection.info;

      const newConnection = knex({
        client: type === 'MARIADB' ? 'mysql' : type.toLowerCase(),
        connection: {
          host,
          port,
          user,
          password,
          database,
        },
      });

      await newConnection.raw('select 1+1 as result;');

      const newConnectionData = {
        info: {
          ...connection.info,
          database,
        },
        connection: newConnection,
      };

      connections[connectionId] = newConnectionData;
    }
  );
}
