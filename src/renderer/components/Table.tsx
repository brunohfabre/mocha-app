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
}

interface RowProps {
  defaultValue: string;
}

function Row({ defaultValue }: RowProps): JSX.Element {
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

  return (
    <input
      ref={inputRef}
      type="text"
      className="flex-1 whitespace-nowrap bg-red-200"
      style={{ minWidth: initialWidth, width: '100%' }}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export function Table({ fields, rows }: TableProps): JSX.Element {
  const [items, setItems] = useState<{ [key: string]: string }>({});

  function handleUpdate(): void {
    console.log(rows);
    console.log(items);
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
              <Row defaultValue={row[field.name]} />
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
