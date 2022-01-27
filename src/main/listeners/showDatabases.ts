import { ipcMain } from 'electron';
import { connections } from '../connections';

interface ShowDatabasesData {
  connectionId: string;
}

type DatabaseType = {
  name: string;
  tablesCount: number;
};

export function showDatabases(): void {
  ipcMain.handle(
    'show-databases',
    async (_, data: ShowDatabasesData): Promise<void> => {
      const { connectionId } = data;

      const connection = connections[connectionId];

      if (!connection) {
        throw new Error('Connection not found.');
      }

      let databases = [];

      if (connection.info.type === 'POSTGRES') {
        const { rows } = await connection.connection.raw(
          'SELECT datname FROM pg_database;'
        );

        databases = rows.map((item: { datname: string }) => ({
          name: item.datname,
          tablesCount: 'TODO',
        }));
      }

      if (
        connection.info.type === 'MYSQL' ||
        connection.info.type === 'MARIADB'
      ) {
        const [rows] = await connection.connection.raw('show databases;');

        databases = rows.map((item: { Database: string }) => ({
          name: item.Database,
          tablesCount: 'TODO',
        }));
      }

      return databases;
    }
  );
}
