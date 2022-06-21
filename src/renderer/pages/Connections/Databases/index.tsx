import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { usePageTitle } from 'renderer/hooks/pageTitleHook';

import { useLoading } from '@hooks/loadingHook';

import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { Modal } from '@components/Modal';

type DatabaseType = {
  name: string;
  tablesCount: number;
};

export function Databases(): JSX.Element {
  const navigate = useNavigate();
  const { connection_id: connectionId } =
    useParams<{ connection_id: string }>();

  const { replaceTitle } = usePageTitle();

  const { setLoading } = useLoading();

  const searchFormRef = useRef<FormHandles>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [databases, setDatabases] = useState<DatabaseType[]>([]);
  const [filteredDatabases, setFilteredDatabases] = useState<DatabaseType[]>(
    []
  );

  useEffect(() => {
    async function loadDatabases(): Promise<void> {
      try {
        setLoading(true);

        const response = await window.electron.invoke('show-databases', {
          connectionId,
        });

        const info = await window.electron.invoke('get-connection-info', {
          id: connectionId,
        });

        setDatabases(response);

        replaceTitle(info.name);
      } catch (err: any) {
        console.error(err.message);
        toast.error(err.message.toLowerCase().split('error:')[1].trimStart());
      } finally {
        setLoading(false);
      }
    }

    if (connectionId) {
      loadDatabases();
    }
  }, [connectionId, replaceTitle]);

  useEffect(() => {
    setFilteredDatabases(databases);

    setSearch('');
  }, [databases]);

  useEffect(() => {
    function handleSearch(): void {
      setFilteredDatabases(
        databases.filter((database) =>
          database.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    handleSearch();
  }, [search, databases]);

  async function handleSelectDatabase(database: string): Promise<void> {
    try {
      setLoading(true);

      await window.electron.invoke('select-database', {
        connectionId,
        database,
      });

      navigate(`${database}/tables`, {
        state: {
          database,
        },
      });
    } catch (err: any) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Modal
        isOpen={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        title="Add database"
      >
        add database
      </Modal>

      <Form
        ref={searchFormRef}
        onSubmit={() => undefined}
        className="p-4 flex justify-between"
      >
        <Input
          name="search"
          placeholder="search"
          className="w-80"
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />

        <Button type="button" onClick={() => setModalVisible(true)}>
          add database
        </Button>
      </Form>

      <div className="p-4 grid grid-cols-4 gap-2">
        {filteredDatabases.map((database) => (
          <button
            type="button"
            key={database.name}
            className="p-4 bg-gray-200 hover:bg-gray-300 flex justify-between"
            onClick={() => handleSelectDatabase(database.name)}
          >
            <span>{database.name}</span>

            <span>{database.tablesCount} tables</span>
          </button>
        ))}
      </div>
    </>
  );
}
