import { TypeOrmVisitor as Visitor } from './visitor';
import { SQLLang } from 'odata-v4-sql';
import { Token } from 'odata-v4-parser/lib/lexer';
export interface SqlOptions {
    useParameters?: boolean;
    type?: SQLLang;
    alias?: string;
}
/**
 * Creates an SQL query descriptor from an OData query string
 * @param {string} odataQuery - An OData query string
 * @return {string}  SQL query descriptor
 * @example
 * const filter = createQuery("$filter=Size eq 4 and Age gt 18");
 * let sqlQuery = `SELECT * FROM table WHERE ${filter.where}`;
 */
export declare function createQuery(odataQuery: string, options?: SqlOptions): Visitor;
export declare function createQuery(odataQuery: Token, options?: SqlOptions): Visitor;
/**
 * Creates an SQL WHERE clause from an OData filter expression string
 * @param {string} odataFilter - A filter expression in OData $filter format
 * @return {string}  SQL WHERE clause
 * @example
 * const filter = createFilter("Size eq 4 and Age gt 18");
 * let sqlQuery = `SELECT * FROM table WHERE ${filter}`;
 */
export declare function createFilter(odataFilter: string, options?: SqlOptions): Visitor;
export declare function createFilter(odataFilter: Token, options?: SqlOptions): Visitor;
