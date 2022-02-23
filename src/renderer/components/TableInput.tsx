import { useState } from 'react';

type FieldType = {
  name: string;
  type: string;
};

type RowType = { [key: string]: string };

interface TableProps {
  fields: FieldType[];
  rows: RowType[];
}

export function TableInput({ fields, rows }: TableProps): JSX.Element {
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
                <td>
                  <input type="text" value={row[field.name]} />
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
