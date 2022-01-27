import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Button } from 'renderer/components/Button';
import { Input } from 'renderer/components/Input';
import { Modal } from 'renderer/components/Modal';
import { Spin } from 'renderer/components/Spin';

type DatabaseType = {
  name: string;
  tablesCount: number;
};

export function Databases(): JSX.Element {
  const { connection_id: connectionId } =
    useParams<{ connection_id: string }>();

  const searchFormRef = useRef<FormHandles>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [databases, setDatabases] = useState<DatabaseType[]>([]);
  const [filteredDatabases, setFilteredDatabases] = useState<DatabaseType[]>(
    []
  );

  useEffect(() => {
    async function loadDatabases(): Promise<void> {
      try {
        setIsLoading(true);

        const response = await window.electron.invoke('show-databases', {
          connectionId,
        });

        setDatabases(response);
        setDatabases(response);
      } catch (err: any) {
        console.log(err.message);

        toast.error(err.message.toLowerCase().split('error:')[1].trimStart());
      } finally {
        setIsLoading(false);
      }
    }

    if (connectionId) {
      loadDatabases();
    }
  }, [connectionId]);

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

  return (
    <>
      <Spin spinning={isLoading} />

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
          <Link to="1/tables" className="p-4 bg-gray-300 flex justify-between">
            <span>{database.name}</span>

            <span>{database.tablesCount} tables</span>
          </Link>
        ))}
      </div>
    </>
  );
}
