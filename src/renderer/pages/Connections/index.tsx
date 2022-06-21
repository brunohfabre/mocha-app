import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Alert } from 'renderer/components/Alert';
import { Button } from 'renderer/components/Button';
import { Input } from 'renderer/components/Input';
import { Modal } from 'renderer/components/Modal';
import getValidationErrors from 'renderer/helpers/getValidationErrors';
import { usePageTitle } from 'renderer/hooks/pageTitleHook';
import { api } from 'renderer/services/api';
import * as Yup from 'yup';

import { ProjectContext } from '@contexts/ProjectContext';

import { useLoading } from '@hooks/loadingHook';

import { ConnectionItem } from './ConnectionItem';

interface FormData {
  name: string;
  host: string;
  port: string;
  user: string;
  password: string;
}

type ConnectionType = 'POSTGRES' | 'MYSQL' | 'MARIADB';

interface Connection {
  id: string;
  type: ConnectionType;
  name: string;
  host: string;
  port: number;
  user: string;
  password: string;
  updated_at: Date;
}

function ConnectionTypeButton({
  type,
  isActive,
  onClick,
}: {
  type: ConnectionType;
  isActive: boolean;
  onClick: (type: ConnectionType) => void;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={() => onClick(type)}
      className={`h-32 ${isActive ? 'bg-gray-400' : 'bg-gray-200'}`}
    >
      {type}
    </button>
  );
}

export function Connections(): JSX.Element {
  const { projectSelected } = useContext(ProjectContext);

  const { setLoading } = useLoading();

  const formRef = useRef<FormHandles>(null);
  const searchFormRef = useRef<FormHandles>(null);

  const { replaceTitle } = usePageTitle();

  const [modalVisible, setModalVisible] = useState(false);
  const [typeSelected, setTypeSelected] = useState<ConnectionType>('POSTGRES');
  const [connections, setConnections] = useState<Connection[]>([]);
  const [filteredConnections, setFilteredConnections] = useState<Connection[]>(
    []
  );
  const [connectionHasBeenTested, setConnectionHasBeenTested] = useState(false);
  const [withoutTestingAlert, setWithoutTestingAlert] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    replaceTitle('Databases');
  }, [replaceTitle]);

  useEffect(() => {
    setFilteredConnections(connections);

    setSearch('');
  }, [connections]);

  useEffect(() => {
    function handleSearch(): void {
      setFilteredConnections(
        connections.filter((connection) =>
          connection.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    handleSearch();
  }, [search, connections]);

  useEffect(() => {
    async function loadConnections(): Promise<void> {
      setLoading(true);

      const response = await api.get('/connections', {
        headers: {
          'x-project-selected': projectSelected.id,
        },
      });

      setConnections(response.data);

      setLoading(false);
    }

    loadConnections();
  }, [setLoading, projectSelected.id]);

  function handleCloseModal(): void {
    setModalVisible(false);

    setConnectionHasBeenTested(false);
  }

  async function handleCreateConnection(): Promise<void> {
    try {
      setLoading(true);

      const data = formRef.current?.getData();

      const { name, host, port, user, password } = data as FormData;

      const response = await api.post(
        '/connections',
        {
          type: typeSelected,
          name,
          host,
          port: Number(port),
          user,
          password,
        },
        {
          headers: {
            'x-project-selected': projectSelected.id,
          },
        }
      );

      setConnections((state) => [...state, response.data]);

      toast.success('Connection added successfully.');

      setWithoutTestingAlert(false);
      handleCloseModal();
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(data: FormData): Promise<void> {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required(),
        host: Yup.string().required(),
        port: Yup.string().required(),
        user: Yup.string().required(),
        password: Yup.string().required(),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      if (!connectionHasBeenTested) {
        setWithoutTestingAlert(true);

        return;
      }

      setLoading(true);

      handleCreateConnection();
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);
        return;
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleTestConnection(): Promise<void> {
    try {
      const data = formRef.current?.getData();

      const { host, port, user, password } = data as FormData;

      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        host: Yup.string().required(),
        port: Yup.string().required(),
        user: Yup.string().required(),
        password: Yup.string().required(),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      setLoading(true);

      await window.electron.invoke('test-connection', {
        type: typeSelected,
        host,
        port: Number(port),
        user,
        password,
      });

      setConnectionHasBeenTested(true);

      toast.success('Successfully connected.');
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);
        return;
      }

      toast.error(err.message.toLowerCase().split('error:')[1].trimStart());
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Modal
        isOpen={modalVisible}
        onRequestClose={handleCloseModal}
        title="Add connection"
      >
        <div className="grid grid-cols-3 gap-2">
          <ConnectionTypeButton
            type="POSTGRES"
            onClick={(type) => setTypeSelected(type)}
            isActive={typeSelected === 'POSTGRES'}
          />
          <ConnectionTypeButton
            type="MYSQL"
            onClick={(type) => setTypeSelected(type)}
            isActive={typeSelected === 'MYSQL'}
          />
          <ConnectionTypeButton
            type="MARIADB"
            onClick={(type) => setTypeSelected(type)}
            isActive={typeSelected === 'MARIADB'}
          />
        </div>

        <Form ref={formRef} onSubmit={handleSubmit} className="mt-4">
          <div className="flex flex-col gap-2">
            <div>
              <Input
                name="name"
                placeholder="Name"
                label="Name"
                className="w-full"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              <Input
                name="host"
                placeholder="Host"
                label="Host"
                className="col-span-3"
              />
              <Input name="port" placeholder="Port" label="Port" />
            </div>
            <div>
              <Input
                name="user"
                placeholder="User"
                label="User"
                className="w-full"
              />
            </div>
            <div>
              <Input
                name="password"
                placeholder="Password"
                label="Password"
                className="w-full"
              />
            </div>
          </div>

          <footer className="mt-8 flex justify-between">
            <Button type="button" onClick={handleTestConnection}>
              test
            </Button>

            <div className="flex gap-2">
              <Button type="button" onClick={handleCloseModal}>
                cancel
              </Button>

              <Button type="submit">add</Button>
            </div>
          </footer>
        </Form>
      </Modal>

      <Alert
        isOpen={withoutTestingAlert}
        onRequestClose={() => setWithoutTestingAlert(false)}
        title="Are sure?"
      >
        <p>Continue without testing connection?</p>

        <div className="grid grid-cols-2 gap-2">
          <Button type="button" onClick={() => setWithoutTestingAlert(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleCreateConnection}>
            Yes
          </Button>
        </div>
      </Alert>

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
          add connection
        </Button>
      </Form>

      <div className="p-4 grid grid-cols-4 gap-2">
        {filteredConnections.map((connection) => (
          <ConnectionItem
            key={connection.id}
            connection={connection}
            onDelete={() => {
              setConnections((state) =>
                state.filter((item) => item.id !== connection.id)
              );
            }}
          />
        ))}
      </div>
    </>
  );
}
