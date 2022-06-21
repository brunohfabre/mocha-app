import { omit } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useParams } from 'react-router-dom';

import { commandOrCtrl } from '@helpers/commandOrCtrl';

import { useLoading } from '@hooks/loadingHook';

type FieldType = {
  name: string;
};

type RowType = { [key: string]: string };

interface TableProps {
  fields: FieldType[];
  rows: RowType[];
  updateRows: (items: {
    [key: string]: { [key: string]: string | number };
  }) => void;
  lastQuery?: string;
}

interface RowProps {
  defaultValue: string;
  isUpdated: boolean;
  setToUpdate: (value: string) => void;
}

function Row({ defaultValue, isUpdated, setToUpdate }: RowProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState(defaultValue);

  const [initialWidth, setInitialWidth] = useState(0);

  useEffect(() => {
    if (inputRef.current) {
      if (!initialWidth) {
        setInitialWidth(inputRef.current.scrollWidth);
      }
    }
  }, [inputRef, initialWidth]);

  function handleBlur(): void {
    if (inputRef.current) {
      setToUpdate(inputRef.current.value);
    }
  }

  return (
    <input
      ref={inputRef}
      type="text"
      className={`flex-1 whitespace-nowrap ${
        isUpdated ? 'bg-orange-400' : 'bg-red-200'
      }`}
      style={{ minWidth: initialWidth, width: '100%' }}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
    />
  );
}

export function Table({
  fields,
  rows,
  updateRows,
  lastQuery,
}: TableProps): JSX.Element {
  const { connection_id: connectionId } =
    useParams<{ connection_id: string }>();

  const { setLoading } = useLoading();

  const [items, setItems] = useState<{
    [key: string]: { [key: string]: string | number };
  }>({});

  async function handleUpdate(): Promise<void> {
    try {
      if (!Object.keys(items).length) {
        throw new Error('nao tem items');
      }

      if (!lastQuery) {
        throw new Error('nao tem lastquery');
      }

      if (lastQuery.split(' ')[0] !== 'select') {
        throw new Error('nao e select');
      }

      if (lastQuery.includes('join')) {
        throw new Error('nao pode ter join');
      }

      setLoading(true);

      const filteredItems = Object.keys(items).filter(
        (key: string) => !!Object.keys(items[key]).length
      );

      const splittedQuery = lastQuery.replaceAll(';', '').split(' ');

      const fromIndex = splittedQuery.findIndex(
        (item: string) => item === 'from'
      );

      const tableName = splittedQuery[fromIndex + 1];

      const result = filteredItems.map((item: string) => ({
        changed: items[item],
        initial: rows.find((row) => row.rowId === item),
      }));

      await window.electron.invoke('update-field', {
        connectionId,
        table: tableName,
        rows: result,
      });

      updateRows(items);

      setItems({});
    } catch (err: any) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }

  useHotkeys(
    `${commandOrCtrl()}+s`,
    () => {
      handleUpdate();
    },
    {
      enableOnTags: ['INPUT', 'SELECT', 'TEXTAREA'],
    },
    [items]
  );

  return (
    <>
      <div
        className="w-full grid"
        style={{
          gridTemplateColumns: `repeat(${fields.length}, 1fr)`,
        }}
      >
        {fields.map((field) => (
          <div className="bg-red-300">{field.name}</div>
        ))}

        {rows.map((row) => (
          <>
            {fields.map((field) => (
              <Row
                defaultValue={row[field.name]}
                isUpdated={items[row.rowId] && !!items[row.rowId][field.name]}
                setToUpdate={(value) => {
                  const teste =
                    typeof row[field.name] === 'number' ? Number(value) : value;

                  if (row[field.name] === teste) {
                    setItems((prevState) => {
                      const newState = omit(prevState[row.rowId], [field.name]);

                      if (!Object.keys(newState).length) {
                        return omit(prevState, [row.rowId]);
                      }

                      return {
                        ...prevState,
                        [row.rowId]: newState,
                      };
                    });
                  } else {
                    setItems((prevState) => ({
                      ...prevState,
                      [row.rowId]: {
                        ...prevState[row.rowId],
                        [field.name]: teste,
                      },
                    }));
                  }
                }}
              />
            ))}
          </>
        ))}
      </div>
    </>
  );
}
