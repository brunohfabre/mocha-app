import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from 'renderer/components/Button';
import { Input } from 'renderer/components/Input';
import { Modal } from 'renderer/components/Modal';

export function Databases(): JSX.Element {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Modal
        isOpen={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        title="Add database"
      >
        add database
      </Modal>

      <header className="p-4 flex justify-between">
        <Input placeholder="search" />

        <Button onClick={() => setModalVisible(true)}>add database</Button>
      </header>

      <div className="p-4 grid grid-cols-4 gap-2">
        <Link to="1/tables" className="p-4 bg-gray-300 flex justify-between">
          <span>database_name</span>

          <span>67 tables</span>
        </Link>

        <Link to="1/tables" className="p-4 bg-gray-300 flex justify-between">
          <span>database_name</span>

          <span>7 tables</span>
        </Link>

        <Link to="1/tables" className="p-4 bg-gray-300 flex justify-between">
          <span>database_name</span>

          <span>299 tables</span>
        </Link>
      </div>
    </>
  );
}
