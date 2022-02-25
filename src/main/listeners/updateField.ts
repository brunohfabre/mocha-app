import { ipcMain } from 'electron';

import { connections } from '../connections';

interface ShowDatabasesData {
  connectionId: string;
  table: string;
  rows: {
    initial: { [key: string]: string };
    changed: { [key: string]: string };
  }[];
}

export function updateField(): void {
  ipcMain.handle(
    'update-field',
    async (_, data: ShowDatabasesData): Promise<boolean> => {
      const { connectionId, table, rows } = data;

      const connection = connections[connectionId];

      if (!connection) {
        throw new Error('Connection not found.');
      }

      const queries: string[] = [];

      if (connection.info.type === 'POSTGRES') {
        const response = await connection.connection.raw(`
          SELECT a.attname, format_type(a.atttypid, a.atttypmod) AS data_type
          FROM   pg_index i
          JOIN   pg_attribute a ON a.attrelid = i.indrelid
                              AND a.attnum = ANY(i.indkey)
          WHERE  i.indrelid = 'projects'::regclass
          AND    i.indisprimary;
        `);

        const primaryKey = {
          name: response.rows[0].attname,
          type: response.rows[0].data_type,
        };

        rows.forEach((row) => {
          let newValues = '';

          Object.keys(row.changed).forEach((item) => {
            const value = `${item} = ${
              ['boolean', 'number'].includes(typeof row.changed[item])
                ? row.changed[item]
                : `'${row.changed[item]}'`
            }`;

            if (newValues.length) {
              newValues = `${newValues}, ${value}`;
            } else {
              newValues = value;
            }
          });

          queries.push(`
            UPDATE ${table}
            SET ${newValues}
            WHERE ${primaryKey.name} = ${
            primaryKey.type === 'text'
              ? `'${row.initial[primaryKey.name]}'`
              : row.initial[primaryKey.name]
          };
          `);
        });
      }

      if (
        connection.info.type === 'MYSQL' ||
        connection.info.type === 'MARIADB'
      ) {
        const response = await connection.connection.raw(
          `SHOW COLUMNS from ${table}`
        );

        const findPrimaryKey = response[0].find(
          (row: { Field: string; Type: string; Key: string }) =>
            row.Key === 'PRI'
        );

        const primaryKey = {
          name: findPrimaryKey.Field,
          type: findPrimaryKey.Type.split('(')[0],
        };

        rows.forEach((row) => {
          let newValues = '';

          Object.keys(row.changed).forEach((item) => {
            const value = `${item} = ${
              ['boolean', 'number', 'int', 'bigint'].includes(
                typeof row.changed[item]
              )
                ? row.changed[item]
                : `'${row.changed[item]}'`
            }`;

            if (newValues.length) {
              newValues = `${newValues}, ${value}`;
            } else {
              newValues = value;
            }
          });

          queries.push(`
            UPDATE ${table}
            SET ${newValues}
            WHERE ${primaryKey.name} = ${
            primaryKey.type === 'text'
              ? `'${row.initial[primaryKey.name]}'`
              : row.initial[primaryKey.name]
          };
          `);
        });
      }

      connection.connection.transaction((trx) => {
        return Promise.all(
          queries.map((query) =>
            connection.connection.raw(query).transacting(trx)
          )
        );
      });

      return true;
    }
  );
}
