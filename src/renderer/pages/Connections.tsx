import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';

import { Form } from '@unform/web';

import { Button } from 'renderer/components/Button';
import { Input } from 'renderer/components/Input';
import { Modal } from 'renderer/components/Modal';
import { FormHandles } from '@unform/core';
import { useLoading } from 'renderer/hooks/loadingHook';
import getValidationErrors from 'renderer/helpers/getValidationErrors';
import { toast } from 'react-toastify';

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

type ConnectionType = 'postgres' | 'mysql' | 'mariadb';

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

  const { setLoading } = useLoading();

  const [modalVisible, setModalVisible] = useState(false);
  const [typeSelected, setTypeSelected] = useState<ConnectionType>('postgres');

  async function handleSubmit(data: FormData): Promise<void> {
    console.log(data);
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

      setLoading(true);

      await window.electron.invoke('test-connection', {
        type: typeSelected === 'mariadb' ? 'mysql' : typeSelected,
        host,
        port: Number(port),
        user,
        password,
      });

      toast.success('Successfully connected.');
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);
        return;
      }

      toast.error(err.message.split('Error:')[1].trimStart());
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Modal
        isOpen={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        title="Add connection"
      >
        <div className="grid grid-cols-3 gap-2">
          <ConnectionTypeButton
            type="postgres"
            onClick={(type) => setTypeSelected(type)}
            isActive={typeSelected === 'postgres'}
          />
          <ConnectionTypeButton
            type="mysql"
            onClick={(type) => setTypeSelected(type)}
            isActive={typeSelected === 'mysql'}
          />
          <ConnectionTypeButton
            type="mysql"
            onClick={(type) => setTypeSelected(type)}
            isActive={typeSelected === 'mariadb'}
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
              <Button type="button" onClick={() => setModalVisible(false)}>
                cancel
              </Button>

              <Button type="submit">add</Button>
            </div>
          </footer>
        </Form>
      </Modal>

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
        <Link to="1/databases" className="p-4 bg-gray-300 flex flex-col gap-4">
          <header className="flex justify-between">
            <span>connection_name</span>

            <span>postgres</span>
          </header>

          <div>192.168.0.1</div>
        </Link>

        <Link to="1/databases" className="p-4 bg-gray-300 flex flex-col gap-4">
          <header className="flex justify-between">
            <span>connection_name</span>

            <span>mysql</span>
          </header>

          <div>192.168.0.1</div>
        </Link>

        <Link to="1/databases" className="p-4 bg-gray-300 flex flex-col gap-4">
          <header className="flex justify-between">
            <span>connection_name</span>

            <span>mariadb</span>
          </header>

          <div>192.168.0.1</div>
        </Link>
      </div>
    </>
  );
}
