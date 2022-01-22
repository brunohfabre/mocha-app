import { Routes as Switch, Route } from 'react-router-dom';

import { Notes } from 'renderer/pages/Notes';
import { Rest } from 'renderer/pages/Rest';
import { Table } from '../pages/Table';
import { Home } from '../pages/Home';
import { Connections } from '../pages/Connections';
import { Databases } from '../pages/Databases';
import { Tables } from '../pages/Tables';

export function AppRoutes(): JSX.Element {
  return (
    <Switch>
      <Route path="/" element={<Home />} />

      <Route path="/connections" element={<Connections />} />
      <Route
        path="/connections/:connection_id/databases"
        element={<Databases />}
      />
      <Route
        path="/connections/:connection_id/databases/:database_id/tables"
        element={<Tables />}
      />
      <Route
        path="/connections/:connection_id/databases/:database_id/tables/:table_id"
        element={<Table />}
      />

      <Route path="/notes" element={<Notes />} />

      <Route path="/rest" element={<Rest />} />
    </Switch>
  );
}
