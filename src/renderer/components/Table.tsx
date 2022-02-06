import { useEffect, useMemo, useRef, useState } from 'react';
import { format } from 'date-fns';
import { omit } from 'lodash';

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
  const [items, setItems] = useState<{ [key: string]: string }>({});

  function handleUpdate(): void {
    try {
      console.log('LAST QUERY: ', lastQuery);

      if (!lastQuery) {
        throw new Error('nao tem lastquery');
      }

      if (lastQuery.split(' ')[0] !== 'select') {
        throw new Error('nao e select');
      }

      if (lastQuery.includes('join')) {
        throw new Error('nao pode ter join');
      }

      const filteredItems = Object.keys(items).filter(
        (key: string) => !!Object.keys(items[key]).length
      );

      const splittedQuery = lastQuery.replaceAll(';', '').split(' ');

      const fromIndex = splittedQuery.findIndex(
        (item: string) => item === 'from'
      );

      const tableName = splittedQuery[fromIndex + 1];

      console.log(filteredItems, tableName);
    } catch (err: any) {
      console.log(err.message);
    }
  }

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
                isUpdated={items[row.rowId] && items[row.rowId][field.name]}
                setToUpdate={(value) => {
                  if (row[field.name] === value) {
                    setItems((prevState) => ({
                      ...prevState,
                      [row.rowId]: omit(prevState[row.rowId], [field.name]),
                    }));
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

      <button type="button" onClick={handleUpdate}>
        save
      </button>
    </>
  );
}
