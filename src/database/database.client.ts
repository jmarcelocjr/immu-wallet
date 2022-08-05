import { Injectable } from "@nestjs/common";
import ImmudbClient from "immudb-node";
import { ObjectValue } from "src/common/common.dto";
import { FindParameter, isWithOperatorType, OperatorType, SQLValue } from "./dto";

@Injectable()
export class DatabaseClient<T> {
    private client?: ImmudbClient;

    async getClient(): Promise<ImmudbClient> {
        if (this.client instanceof ImmudbClient) {
            return this.client;
        }

        this.client = await ImmudbClient.getInstance({
            host: process.env.IMMUDB_HOST,
            port: process.env.IMMUDB_PORT,
            user: process.env.IMMUDB_USER,
            password: process.env.IMMUDB_PASSWORD,
            database: process.env.IMMUDB_DATABASE
        });

        return this.getClient();
    }

    async create(table_name: string, params: ObjectValue<SQLValue>): Promise<boolean> {
        let sql = `INSERT INTO ${table_name} (${Object.keys(params).join(',')}) VALUES (@${Object.keys(params).join(', @')})`;

        return this.exec(sql, params);
    }

    async update(table_name: string, params: ObjectValue<SQLValue>, where: FindParameter<SQLValue>|FindParameter<SQLValue>[]): Promise<boolean> {
        let paramsSql = Object.keys(params).map((key => `${key} = @${key}`));
        const result = this.mapWhere(where);

        let sql = `UPDATE ${table_name} SET ${paramsSql.join(' , ')} WHERE ${result.whereSql}`;

        return this.exec(
            sql,
            { ...params, ...result.params }
        );
    }

    async findOneBy(table_name: string, where: FindParameter<SQLValue>|FindParameter<SQLValue>[]): Promise<T> {
        const {whereSql, params} = this.mapWhere(where);

        const sql = `SELECT * FROM ${table_name} WHERE ${whereSql}`;
        const result = await this.query(
            sql,
            params
        );

        return result.shift() as unknown as T;
    }

    async findBy(table_name: string, where: FindParameter<SQLValue>|FindParameter<SQLValue>[]): Promise<T[]> {
        const {whereSql, params} = this.mapWhere(where);

        const sql = `SELECT * FROM ${table_name} WHERE ${whereSql}`;
        const result = await this.query(sql, params);

        return result as unknown as T[];
    }

    async exec(sql: string, params: ObjectValue<SQLValue>): Promise<boolean> {
        return (await this.getClient()).SQLExec({
            sql,
            params
        }).then(() => true)
        .catch(error => {
            console.log(error);
            return false;
        });
    }

    async query(sql: string, params: ObjectValue<SQLValue>): Promise<any> {
        return (await this.getClient()).SQLQuery({
            sql,
            params
        });
    }

    private mapWhere(where: FindParameter<SQLValue>|FindParameter<SQLValue>[]): {whereSql: string, params: ObjectValue<SQLValue>} {
        let params = {};
        let whereSql = '';

        if (where instanceof Array) {
          const conditions = [];
          for (const rules of where) {
            const result = this.mapWhere(rules);

            params = {...params, ...result.params};

            conditions.push(`(${result.whereSql})`);
          }

          whereSql += conditions.join(' OR ');

          return {
            whereSql,
            params
          }
        }

        const conditions = []
        for (const field in where) {
            const value = where[field];
            const rule = isWithOperatorType(value)
                ? Object.keys(value)[0] as OperatorType
                : "$equal";

            const operator = this.getOperator(rule);
            conditions.push(`${field} ${operator} @${field}`);

            params[field] = isWithOperatorType(value) ? value[rule] : value;
        }

        whereSql += conditions.join(' AND ');

        return {
          whereSql,
          params
        }
    }

    private getOperator(operator_name: OperatorType): string {
        switch (operator_name) {
            case "$equal":
                return `=`;
            case "$notEqual":
                return `!=`;
            case "$lessThan":
                return `<`;
            case "$lessThanOrEqual":
                return `<=`;
            case "$moreThan":
                return `>`;
            case "$moreThanOrEqual":
                return `>=`;
            case "$like":
                return `LIKE`;
            case "$notLike":
                return `NOT LIKE`;
            default:
                return "=";
        }
    };
}