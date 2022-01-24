import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';

import { Form } from '@unform/web';

import { Button } from 'renderer/components/Button';
import { Input } from 'renderer/components/Input';
import { Modal } from 'renderer/components/Modal';
import { Alert } from 'renderer/components/Alert';
import { Spin } from 'renderer/components/Spin';
import { FormHandles } from '@unform/core';
import getValidationErrors from 'renderer/helpers/getValidationErrors';
import { toast } from 'react-toastify';
import { api } from 'renderer/services/api';

interface FormData {
  name: string;
  host: string;
  port: string;
  user: string;
  password: string;
}

interface SearchFormData {
  search: string;
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
  const formRef = useRef<FormHandles>(null);
  const searchFormRef = useRef<FormHandles>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [typeSelected, setTypeSelected] = useState<ConnectionType>('POSTGRES');
  const [connections, setConnections] = useState<Connection[]>([]);
  const [connectionHasBeenTested, setConnectionHasBeenTested] = useState(false);
  const [withoutTestingAlert, setWithoutTestingAlert] = useState(false);

  useEffect(() => {
    async function loadConnections(): Promise<void> {
      setIsLoading(true);

      const response = await api.get('/connections');

      setConnections(response.data);

      setIsLoading(false);
    }

    loadConnections();
  }, [setIsLoading]);

  function handleCloseModal(): void {
    setModalVisible(false);

    setConnectionHasBeenTested(false);
  }

  async function handleCreateConnection(): Promise<void> {
    try {
      setIsLoading(true);

      const data = formRef.current?.getData();

      const { name, host, port, user, password } = data as FormData;

      const response = await api.post('/connections', {
        type: typeSelected,
        name,
        host,
        port: Number(port),
        user,
        password,
      });

      setConnections((state) => [...state, response.data]);

      toast.success('Connection added successfully.');

      setWithoutTestingAlert(false);
      handleCloseModal();
    } finally {
      setIsLoading(false);
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

      handleCreateConnection();
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);
        return;
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmitSearch(data: SearchFormData): Promise<void> {
    console.log(data);
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

      setIsLoading(true);

      await window.electron.invoke('test-connection', {
        type: typeSelected === 'MARIADB' ? 'mysql' : typeSelected.toLowerCase(),
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

      toast.error(err.message.split('Error:')[1].trimStart());
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Spin spinning={isLoading} />

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
        onSubmit={handleSubmitSearch}
        className="p-4 flex justify-between"
      >
        <Input name="search" placeholder="search" className="w-80" />

        <Button type="button" onClick={() => setModalVisible(true)}>
          add connection
        </Button>
      </Form>

      <div className="p-4 grid grid-cols-4 gap-2">
        {connections.map((connection) => (
          <Link
            to="1/databases"
            className="p-4 bg-gray-300 flex flex-col gap-4"
            key={connection.id}
          >
            <header className="flex justify-between">
              <span>{connection.name}</span>

              <span>{connection.type}</span>
            </header>

            <div>
              {connection.host}:{connection.port}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
