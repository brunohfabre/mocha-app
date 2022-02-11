import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Insidebar } from 'renderer/components/Insidebar';
import { Tabs } from 'renderer/components/Tabs';
import { Spin } from 'renderer/components/Spin';

import { Sql } from './Sql';

export function Tables(): JSX.Element {
  const { connection_id: connectionId } =
    useParams<{ connection_id: string }>();

  const [isLoading, setIsLoading] = useState(false);

  const [tables, setTables] = useState<string[]>([]);

  const [tabs, setTabs] = useState<string[]>([]);
  const [tabActive, setTabActive] = useState('sql');

  useEffect(() => {
    async function loadTables(): Promise<void> {
      try {
        setIsLoading(true);

        const response = await window.electron.invoke('show-tables', {
          connectionId,
        });

        setTables(response.sort());
      } catch (err: any) {
        console.log(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadTables();
  }, [connectionId]);

  return (
    <>
      <Spin spinning={isLoading} />

      <div className="flex-1 flex overflow-auto">
        <Insidebar
          functions={[]}
          tables={tables}
          onClick={(value) => {
            setTabs((prevState) => [...prevState, value]);
            setTabActive(value);
          }}
        />

        <Tabs
          tabs={tabs}
          tabActive={tabActive}
          onChange={setTabActive}
          onRemove={(value) =>
            setTabs((prevState) => prevState.filter((tab) => tab !== value))
          }
          sqlComponent={<Sql />}
          tableComponent={<div>table component</div>}
        />
      </div>
    </>
  );
}
