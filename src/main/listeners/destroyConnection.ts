import { ipcMain } from 'electron';

import { connections } from '../connections';

interface DestroyConnectionData {
  id: string;
}

export function destroyConnection(): void {
  ipcMain.handle(
    'destroy-connection',
    async (_, data: DestroyConnectionData): Promise<void> => {
      const { id } = data;

      const connection = connections[id];

      if (connection) {
        await connection.connection.destroy();
      }
    }
  );
}
