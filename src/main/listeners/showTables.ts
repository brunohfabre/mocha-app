import { ipcMain } from 'electron';
import { connections } from '../connections';

interface ShowTablesData {
  connectionId: string;
}

export function showTables(): void {
  ipcMain.handle(
    'show-tables',
    async (_, data: ShowTablesData): Promise<string[]> => {
      const { connectionId } = data;

      const connection = connections[connectionId];

      if (!connection) {
        throw new Error('Connection not found.');
      }

      let tables = [];

      if (connection.info.type === 'POSTGRES') {
        const { rows } = await connection.connection.raw(
          `SELECT table_name
          FROM information_schema.tables
          WHERE table_schema = 'public'
          ORDER BY table_name;`
        );

        tables = rows.map((item: { table_name: string }) => item.table_name);
      }

      if (
        connection.info.type === 'MYSQL' ||
        connection.info.type === 'MARIADB'
      ) {
        const [rows] = await connection.connection.raw(
          `SELECT table_name FROM information_schema.tables WHERE table_schema = '${connection.info.database}';`
        );

        tables = rows.map((item: { table_name: string }) => item.table_name);
      }

      return tables;
    }
  );
}
