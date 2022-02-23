import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Insidebar } from 'renderer/components/Insidebar';
import { Spin } from 'renderer/components/Spin';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from 'renderer/components/Tabs';

import { Sql } from './Sql';
import { TableView } from './TableView';

export function Tables(): JSX.Element {
  const { connection_id: connectionId } =
    useParams<{ connection_id: string }>();

  const [isLoading, setIsLoading] = useState(false);

  const [tables, setTables] = useState<string[]>([]);

  const [tabSelected, setTabSelected] = useState(0);
  const [tabs, setTabs] = useState<string[]>(['sql']);
  const [panels, setPanels] = useState<(() => JSX.Element)[]>([]);

  useEffect(() => {
    async function loadTables(): Promise<void> {
      try {
        setIsLoading(true);

        const response = await window.electron.invoke('show-tables', {
          connectionId,
        });

        setTables(response.sort());

        setPanels([() => <Sql tables={response.sort()} />]);
      } catch (err: any) {
        console.log(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadTables();
  }, [connectionId]);

  function handleDeleteTab(value: number): void {
    const tabsLength = tabs.length;

    setTabs((prevState) => prevState.filter((_, index) => index !== value));
    setPanels((prevState) => prevState.filter((_, index) => index !== value));

    if (tabsLength <= 2) {
      setTabSelected(0);
    }
  }

  return (
    <>
      <Spin spinning={isLoading} />

      <div className="flex-1 flex overflow-auto">
        <Insidebar
          functions={[]}
          tables={tables}
          onClick={(tab) => {
            setTabSelected(tabs.length);
            setTabs((prevState) => [...prevState, tab]);
            setPanels((prevState) => [
              ...prevState,
              () => <TableView table={tab} />,
            ]);
          }}
        />

        <Tabs index={tabSelected} onChange={setTabSelected}>
          <TabList>
            {tabs.map((tab) => (
              <Tab
                key={tab}
                onDelete={
                  tab !== 'sql'
                    ? (value: number) => handleDeleteTab(value)
                    : undefined
                }
              >
                {tab}
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            {panels.map((Panel) => (
              <TabPanel key={JSON.stringify(Panel)}>
                <Panel />
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </div>
    </>
  );
}
