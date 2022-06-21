import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { v4 as uuid } from 'uuid';

import { useLoading } from '@hooks/loadingHook';

import { Table } from '@components/Table';

type TableViewProps = {
  table: string;
};

type FieldType = {
  name: string;
  type: string;
};

export function TableView({ table }: TableViewProps): JSX.Element {
  const { connection_id: connectionId } =
    useParams<{ connection_id: string }>();

  const { setLoading } = useLoading();

  const [lastQuery, setLastQuery] = useState('');
  const [isQuired, setIsQuired] = useState(false);
  const [fields, setFields] = useState<FieldType[]>([]);
  const [rows, setRows] = useState<{ [key: string]: string }[]>([]);
  const [responseTime, setResponseTime] = useState(0);

  useEffect(() => {
    async function handleRunQuery() {
      try {
        const initialTime = Date.now();

        setLoading(true);

        const value = `select * from ${table};`;

        const response = await window.electron.invoke('run-query', {
          connectionId,
          query: value,
        });

        setFields(response.fields);
        setRows(
          response.rows.map((row: { [key: string]: string }) => ({
            ...row,
            rowId: uuid(),
          }))
        );

        const finalTime = Date.now();

        setLastQuery(value);
        setResponseTime(finalTime - initialTime);
        setIsQuired(true);
      } catch (err: any) {
        toast.error(err.message.toLowerCase().split('error:')[1].trimStart());
      } finally {
        setLoading(false);
      }
    }

    if (connectionId && table && !lastQuery) {
      handleRunQuery();
    }
  }, [connectionId, table, lastQuery]);

  function handleUpdateRows(items: { [key: string]: string }) {
    Object.keys(items).forEach((item) => {
      setRows((prevState) =>
        prevState.map((row) =>
          row.rowId === item ? Object.assign(row, items) : row
        )
      );
    });
  }

  return (
    <>
      <section className="flex-1 flex flex-col overflow-auto">
        <div className="bg-orange-100 flex-1 w-full overflow-auto">
          <Table
            fields={fields}
            rows={rows}
            updateRows={handleUpdateRows}
            lastQuery={lastQuery}
          />
        </div>

        {isQuired && (
          <footer className="bg-orange-200 h-10 px-4 flex items-center gap-4">
            <span>{rows.length} rows</span>

            <span>{responseTime} ms</span>
          </footer>
        )}
      </section>
    </>
  );
}
