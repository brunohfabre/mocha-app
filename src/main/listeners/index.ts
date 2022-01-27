import { testConnection } from './testConnection';
import { destroyConnection } from './destroyConnection';
import { connect } from './connect';
import { showDatabases } from './showDatabases';

export function registerListeners(): void {
  testConnection();
  destroyConnection();
  connect();
  showDatabases();
}
