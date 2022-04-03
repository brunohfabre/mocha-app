import { connect } from './connect';
import { destroyConnection } from './destroyConnection';
import { getConnectionInfo } from './getConnectionInfo';
import { runQuery } from './runQuery';
import { selectDatabase } from './selectDatabase';
import { showDatabases } from './showDatabases';
import { showTables } from './showTables';
import { testConnection } from './testConnection';
import { updateField } from './updateField';

export function registerListeners(): void {
  testConnection();
  destroyConnection();
  connect();
  showDatabases();
  selectDatabase();
  showTables();
  runQuery();
  updateField();
  getConnectionInfo();
}
