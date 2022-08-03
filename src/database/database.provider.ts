import ImmudbClient from 'immudb-node';

export const databaseProvider = {
  provide: 'DATABASE_CONNECTION',
  useFactory: async (): Promise<ImmudbClient> => {
    const client = new ImmudbClient({
      host: process.env.IMMUDB_HOST,
      port: process.env.IMMUDB_PORT,
    });

    await client.login({
      user: process.env.IMMUDB_USER,
      password: process.env.IMMUDB_PASSWORD,
    });

    await client.useDatabase({ databasename: process.env.IMMUDB_DATABASE });

    return client;
  },
};
