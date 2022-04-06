import { Routes as Switch, Route } from 'react-router-dom';

import { Connections } from '@pages/Connections';
import { Databases } from '@pages/Connections/Databases';
import { Tables } from '@pages/Connections/Databases/Tables';
import { Table } from '@pages/Connections/Databases/Tables/Table';
import { Home } from '@pages/Home';
import { Notes } from '@pages/Notes';
import { Profile } from '@pages/Profile';
import { Rest } from '@pages/Rest';

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

      <Route path="/profile" element={<Profile />} />
    </Switch>
  );
}
