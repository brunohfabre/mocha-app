import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { Spin } from 'renderer/components/Spin';
import { Table } from 'renderer/components/Table';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

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

  const [isLoading, setIsLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState('');
  const [isQuired, setIsQuired] = useState(false);
  const [fields, setFields] = useState<FieldType[]>([]);
  const [rows, setRows] = useState<{ [key: string]: string }[]>([]);
  const [responseTime, setResponseTime] = useState(0);

  useEffect(() => {
    async function handleRunQuery() {
      try {
        console.log('handle run query');

        const initialTime = Date.now();

        setIsLoading(true);

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
        setIsLoading(false);
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
      <Spin spinning={isLoading} />

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
