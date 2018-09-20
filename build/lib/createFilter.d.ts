import { TypeOrmVisitor as Visitor } from './visitor';
import { Token } from 'odata-v4-parser/lib/lexer';
import { SqlOptions } from './sqlOptions';
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
