import { testConnection } from './testConnection';
import { destroyConnection } from './destroyConnection';
import { connect } from './connect';
import { showDatabases } from './showDatabases';
import { selectDatabase } from './selectDatabase';
import { showTables } from './showTables';

export function registerListeners(): void {
  testConnection();
  destroyConnection();
  connect();
  showDatabases();
  selectDatabase();
  showTables();
}
