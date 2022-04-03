import { ipcMain } from 'electron';

import { ConnectionInfo, connections } from '../connections';

interface GetConnectionInfoData {
  id: string;
}

export function getConnectionInfo(): void {
  ipcMain.handle(
    'get-connection-info',
    async (_, data: GetConnectionInfoData): Promise<ConnectionInfo> => {
      const { id } = data;

      const connection = connections[id];

      return connection.info;
    }
  );
}
