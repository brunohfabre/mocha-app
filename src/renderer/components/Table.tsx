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
    <table className="bg-red-400 w-full">
      <thead>
        <tr>
          {fields.map((field) => (
            <th className="text-left whitespace-nowrap">{field.name}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((row) => (
          <tr>
            {fields.map((field) => (
              <td className="whitespace-nowrap">
                {JSON.stringify(row[field.name])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}