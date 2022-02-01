import { format } from 'date-fns';

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
  return (
    <table className="bg-red-300 w-full">
      <thead>
        <tr>
          {fields.map((field) => (
            <th className="text-left whitespace-nowrap bg-red-400 sticky top-0">
              {field.name}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((row) => (
          <tr>
            {fields.map((field) => (
              <td className="whitespace-nowrap">
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
  );
}
