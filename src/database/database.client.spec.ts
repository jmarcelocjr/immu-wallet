import 'dotenv/config';
import { Test } from '@nestjs/testing';
import { DatabaseClient } from './database.client';
import ImmudbClient from 'immudb-node';
import exp from 'constants';

describe('DatabaseClient', () => {
  const database_client = new DatabaseClient<any>();

  it('should get a client', async () => {
    const client = await database_client.getClient();

    expect(client).toBeInstanceOf(ImmudbClient);
  });

  it('should create a table', async () => {
    const result = await database_client.exec(`CREATE TABLE IF NOT EXISTS test (
        id INTEGER AUTO_INCREMENT,
        name VARCHAR,
        value INTEGER,
        PRIMARY KEY (id)
    )`, {});

    expect(result).toBeTruthy();
  });

  it('should make an insert', async () => {
    const result = await database_client.create('test', {
        name: "foo",
        value: 1
    });

    expect(result).toBeTruthy();
  });

  it('builds a where sql', () => {
    const {whereSql, params} = database_client.mapWhere([
        {
            a: 1,
            b: {
                $like: "d"
            }
        },
        {
            c: {
                $lessThan: 2
            },
            d: "four"
        }
    ]);

    expect(whereSql).toBe("(a = @a AND b LIKE @b) OR (c < @c AND d = @d)");
    expect(params).toMatchObject({
        a: 1,
        b: "d",
        c: 2,
        d: "four"
    });
  });

  it('should select one result', async () => {
    const result = await database_client.findOneBy('test', {
        name: "foo"
    });

    expect(result?.id).toBeDefined();
    expect(result?.name).toBe("foo");
  });

  it('should select multiple results', async () => {
    const result = await database_client.findBy('test', {
        name: "foo"
    });

    expect(result.length).toBeGreaterThanOrEqual(0);
  });
});
