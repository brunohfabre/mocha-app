import { Knex } from 'knex';

type ConnectionType = 'POSTGRES' | 'MYSQL' | 'MARIADB';

interface Connection {
  [key: string]: {
    connection: Knex;
    info: {
      id: string;
      type: ConnectionType;
      name: string;
      host: string;
      port: number;
      user: string;
      password: string;
    };
  };
}

export const connections = {} as Connection;
