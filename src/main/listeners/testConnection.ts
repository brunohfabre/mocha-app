import { ipcMain } from 'electron';

import knex from 'knex';

type ConnectionType = 'postgres' | 'mysql';

interface TestConnectionData {
  type: ConnectionType;
  host: string;
  port: number;
  user: string;
  password: string;
}

export function testConnection(): void {
  ipcMain.handle(
    'test-connection',
    async (_, data: TestConnectionData): Promise<void> => {
      const { type, host, port, user, password } = data;

      const connection = knex({
        client: type,
        connection: {
          host,
          port,
          user,
          password,
        },
      });

      await connection.raw('select 1+1 as result;');

      connection.destroy();
    }
  );
}
