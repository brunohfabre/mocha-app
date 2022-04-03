import { Knex } from 'knex';

type ConnectionType = 'POSTGRES' | 'MYSQL' | 'MARIADB';

export type ConnectionInfo = {
  id: string;
  type: ConnectionType;
  name: string;
  host: string;
  port: number;
  user: string;
  password: string;
  database?: string;
};

interface Connection {
  [key: string]: {
    connection: Knex;
    info: ConnectionInfo;
  };
}

export const connections = {} as Connection;
