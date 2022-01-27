import { ipcMain } from 'electron';

import knex from 'knex';
import { connections } from '../connections';

type ConnectionType = 'POSTGRES' | 'MYSQL' | 'MARIADB';

interface ConnectionData {
  id: string;
  type: ConnectionType;
  name: string;
  host: string;
  port: number;
  user: string;
  password: string;
}

export function connect(): void {
  ipcMain.handle('connect', async (_, data: ConnectionData): Promise<void> => {
    const { id, type, name, host, port, user, password } = data;

    const connection = knex({
      client: type === 'MARIADB' ? 'mysql' : type.toLowerCase(),
      connection: {
        host,
        port,
        user,
        password,
      },
    });

    await connection.raw('select 1+1 as result;');

    connections[id] = {
      connection,
      info: {
        id,
        type,
        name,
        host,
        port,
        user,
        password,
      },
    };
  });
}
