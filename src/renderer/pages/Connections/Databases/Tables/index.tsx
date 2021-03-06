import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { usePageTitle } from 'renderer/hooks/pageTitleHook';

import { useLoading } from '@hooks/loadingHook';

import { Insidebar } from '@components/Insidebar';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@components/Tabs';

import { Sql } from './Sql';
import { TableView } from './TableView';

export function Tables(): JSX.Element {
  const { connection_id: connectionId } =
    useParams<{ connection_id: string }>();
  const { state } = useLocation();

  const { addToTitle } = usePageTitle();

  const { setLoading } = useLoading();

  const [tables, setTables] = useState<string[]>([]);

  const [tabSelected, setTabSelected] = useState(0);
  const [tabs, setTabs] = useState<string[]>(['sql']);
  const [panels, setPanels] = useState<(() => JSX.Element)[]>([]);

  useEffect(() => {
    const { database } = state as { database: string };

    addToTitle(database);
  }, [state]);

  useEffect(() => {
    async function loadTables(): Promise<void> {
      try {
        setLoading(true);

        const response = await window.electron.invoke('show-tables', {
          connectionId,
        });

        setTables(response.sort());

        setPanels([() => <Sql tables={response.sort()} />]);
      } catch (err: any) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadTables();
  }, [connectionId]);

  function handleDeleteTab(tabIndex: number): void {
    let tabsLength = 0;

    setTabs((prevState) => {
      const newTabs = prevState.filter((_, index) => index !== tabIndex);

      tabsLength = newTabs.length;

      return newTabs;
    });
    setPanels((prevState) =>
      prevState.filter((_, index) => index !== tabIndex)
    );

    if (
      (tabSelected === tabIndex && tabIndex === tabsLength) ||
      tabSelected > tabIndex
    ) {
      setTabSelected(tabsLength - 1);
    }
  }

  return (
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
  );
}
