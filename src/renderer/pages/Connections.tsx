import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'renderer/components/Button';
import { Input } from 'renderer/components/Input';
import { Modal } from 'renderer/components/Modal';

export function Connections(): JSX.Element {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Modal
        isOpen={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        title="Add connection"
      >
        <div className="flex flex-col gap-3">
          <div>
            <Input placeholder="name" className="w-full" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            <Input placeholder="host" className="col-span-3" />
            <Input placeholder="port" />
          </div>
          <div>
            <Input placeholder="user" className="w-full" />
          </div>
          <div>
            <Input placeholder="password" className="w-full" />
          </div>
        </div>

        <footer className="mt-12 flex justify-between">
          <Button onClick={() => setModalVisible(false)}>test</Button>

          <div className="flex gap-2">
            <Button onClick={() => setModalVisible(false)}>cancel</Button>
            <Button onClick={() => setModalVisible(false)}>add</Button>
          </div>
        </footer>
      </Modal>

      <header className="p-4 flex justify-between">
        <Input placeholder="search" />

        <Button onClick={() => setModalVisible(true)}>add connection</Button>
      </header>

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
