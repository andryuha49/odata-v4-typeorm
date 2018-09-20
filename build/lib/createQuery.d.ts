import { TypeOrmVisitor as Visitor } from './visitor';
import { Token } from 'odata-v4-parser/lib/lexer';
import { SqlOptions } from './sqlOptions';
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
