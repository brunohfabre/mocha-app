import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContextMenuTrigger, ContextMenu, MenuItem } from 'react-contextmenu';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import getValidationErrors from 'renderer/helpers/getValidationErrors';

import { Alert } from 'renderer/components/Alert';
import { Input } from 'renderer/components/Input';
import { Button } from 'renderer/components/Button';
import { Spin } from 'renderer/components/Spin';
import { toast } from 'react-toastify';
import { api } from 'renderer/services/api';

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

interface FormData {
  name: string;
}

interface ConnectionItemProps {
  connection: Connection;
  onDelete: () => void;
}

export function ConnectionItem({
  connection,
  onDelete,
}: ConnectionItemProps): JSX.Element {
  const navigate = useNavigate();

  const formRef = useRef<FormHandles>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);

  async function handleDelete(data: FormData): Promise<void> {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required(),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      const { name } = data;

      if (name !== connection.name) {
        throw new Error('The name entered is not the same as the connection.');
      }

      setIsLoading(true);

      await window.electron.invoke('destroy-connection', { id: connection.id });

      await api.delete(`/connections/${connection.id}`);

      onDelete();

      toast.success('Connection deleted successfully.');

      setDeleteAlertVisible(false);
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);
      }

      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleConnect(): Promise<void> {
    try {
      setIsLoading(true);

      await window.electron.invoke('connect', connection);

      navigate(`${connection.id}/databases`);
    } catch (err: any) {
      console.log(err.message);

      toast.error(err.message.toLowerCase().split('error:')[1].trimStart());
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Spin spinning={isLoading} />

      <Alert
        isOpen={deleteAlertVisible}
        onRequestClose={() => setDeleteAlertVisible(false)}
        title="Delete connection?"
      >
        <p>
          This action <strong>cannot</strong> be undone. This will permanently
          delete the <strong>{connection.name}</strong> connection.
        </p>
        <p>
          Please type <strong>{connection.name}</strong> to confirm.
        </p>

        <Form ref={formRef} onSubmit={handleDelete}>
          <Input name="name" label="Name" placeholder="Name" autoFocus />

          <div className="grid grid-cols-2 gap-2">
            <Button type="button" onClick={() => setDeleteAlertVisible(false)}>
              Cancel
            </Button>
            <Button type="submit">delete this connection</Button>
          </div>
        </Form>
      </Alert>

      <ContextMenuTrigger
        id={connection.id}
        attributes={{
          className: 'flex',
        }}
      >
        <button
          key={connection.id}
          className="flex-1 p-4 bg-gray-300 flex flex-col gap-4 justify-between"
          onClick={handleConnect}
        >
          <header className="w-full flex justify-between">
            <span className="text-left">{connection.name}</span>

            <span className="text-right">{connection.type}</span>
          </header>

          <div>
            {connection.host}:{connection.port}
          </div>
        </button>
      </ContextMenuTrigger>

      <ContextMenu id={connection.id} className="bg-white py-2 shadow-md w-40">
        <MenuItem
          data={{ foo: 'bar' }}
          onClick={() => setDeleteAlertVisible(true)}
          className="px-4 py-2 cursor-pointer hover:bg-neutral-100"
        >
          Delete
        </MenuItem>
      </ContextMenu>
    </>
  );
}