import { SQLLang } from 'odata-v4-sql';
import { Token } from 'odata-v4-parser/lib/lexer';
import {filter, query} from 'odata-v4-parser';

import { TypeOrmVisitor } from './visitor';
import { SqlOptions } from './sqlOptions';

describe('TypeOrmVisitor', () => {

  describe('VisitSelectItem', () => {
    it('should build fields select query', () => {
      const options: SqlOptions = {
        type: SQLLang.Oracle,
        alias: 'TestTableName',
        useParameters: false,
      }
      const visitor = new TypeOrmVisitor(options);
      const request = '$select=ExpenseDetailID,ExpenseHeaderID,ExpenseDate,Header/CandidateID';
      const token: Token = query(request);

      const result = visitor.Visit(token);

      expect(result.select).toEqual(
        'TestTableName.ExpenseDetailID, ' +
        'TestTableName.ExpenseHeaderID, ' +
        'TestTableName.ExpenseDate, Header.CandidateID');
    });
  });
});