import { useEffect, useRef, useState } from 'react';
import { omit } from 'lodash';
import { useParams } from 'react-router-dom';
import { useHotkeys } from 'react-hotkeys-hook';

import { Spin } from 'renderer/components/Spin';

type FieldType = {
  name: string;
  type: string;
};

type RowType = { [key: string]: string };

interface TableProps {
  fields: FieldType[];
  rows: RowType[];
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
  }, [inputRef]);

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

export function Table({ fields, rows, lastQuery }: TableProps): JSX.Element {
  const { connection_id: connectionId } =
    useParams<{ connection_id: string }>();

  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<{ [key: string]: string }>({});

  const commandOrCtrl = () =>
    window.navigator.platform.match(/^Mac/) ? 'command' : 'ctrl';

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

      setIsLoading(true);

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

      setItems({});
    } catch (err: any) {
      console.log(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useHotkeys(
    `${commandOrCtrl()}+s`,
    () => {
      console.log(items);
      handleUpdate();
    },
    [items]
  );

  return (
    <>
      <Spin spinning={isLoading} />
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
                isUpdated={items[row.rowId] && items[row.rowId][field.name]}
                setToUpdate={(value) => {
                  if (row[field.name] === value) {
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
                        [field.name]: value,
                      },
                    }));
                  }
                }}
              />
            ))}
          </>
        ))}
      </div>
      {/* <table className="bg-red-200 w-full">
        <thead>
          <tr>
            {fields.map((field) => (
              <th className="text-left whitespace-nowrap bg-red-300 sticky top-0">
                {field.name}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr>
              {fields.map((field) => (
                <td
                  className={`whitespace-nowrap ${
                    items[row.rowId] &&
                    items[row.rowId][field.name] &&
                    'bg-orange-400'
                  }`}
                >

                  {field.type === 'text'
                    ? row[field.name]
                    : field.type === 'timestamp'
                    ? format(row[field.name], 'yyyy-MM-dd hh:mm:ss')
                    : JSON.stringify(row[field.name])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table> */}

      {/* {!!Object.keys(items).length && (
        <button type="button" onClick={handleUpdate}>
          save
        </button>
      )} */}
    </>
  );
}
