import { useState } from 'react';
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

export function Table({ fields, rows }: TableProps): JSX.Element {
  const [items, setItems] = useState<{ [key: string]: string }>({});

  function handleUpdate(): void {
    console.log(rows);
    console.log(items);
  }

  return (
    <>
      <table className="bg-red-200 w-full">
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
                  contentEditable
                  onBlur={(e) => {
                    if (e.target?.textContent) {
                      if (e.target.textContent !== row[field.name]) {
                        setItems((prevState) => ({
                          ...prevState,
                          [row.rowId]: {
                            ...items[row.rowId],
                            [field.name]: e.target.textContent,
                          },
                        }));
                      } else {
                        const newItem = omit(items[row.rowId], [field.name]);

                        setItems((prevState) => ({
                          ...prevState,
                          [row.rowId]: newItem,
                        }));
                      }
                    }
                  }}
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
      </table>

      <button type="button" onClick={handleUpdate}>
        save
      </button>
    </>
  );
}
