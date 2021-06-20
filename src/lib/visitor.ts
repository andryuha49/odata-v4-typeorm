import {Token, TokenType} from 'odata-v4-parser/lib/lexer';
import {Literal} from 'odata-v4-literal';
import {SQLLiteral, SQLLang, Visitor} from 'odata-v4-sql/lib/visitor';

export class TypeOrmVisitor extends Visitor {
  includes: TypeOrmVisitor[] = [];
  alias: string = '';
  // all other ones are sorted at the front
  private queryOptionsSort = [TokenType.Select, TokenType.Expand, TokenType.Filter]
  private expands: {[key: string]: string} = {};

  constructor(options) {
    super(options);
    this.type = SQLLang.Oracle;
    this.alias = options.alias || this.alias;
  }

  from(table: string) {
    let sql = `SELECT ${this.select} FROM ${table} WHERE ${this.where} ORDER BY ${this.orderby}`;
    if (typeof this.skip == 'number') sql += ` OFFSET ${this.skip} ROWS`;
    if (typeof this.limit == 'number') {
      if (typeof this.skip != 'number') sql += ' OFFSET 0 ROWS';
      sql += ` FETCH NEXT ${this.limit} ROWS ONLY`;
    }
    return sql;
  }

  proected VisitQueryOptions(node: Token, context: any) {
    node.value.options
      .sort((a:Token, b: Token)=>this.queryOptionsSort.indexOf(a.type) - this.queryOptionsSort.indexOf(b.type))
      .forEach((option) => this.Visit(option, context));
  }

  protected VisitExpand(node: Token, context: any) {
    node.value.items.forEach((item) => {
      let expandPath = item.value.path.raw;
      let visitor = this.includes.filter(v => v.navigationProperty == expandPath)[0];
      if (!visitor) {
        visitor = new TypeOrmVisitor({...this.options, alias: expandPath});
        visitor.parameterSeed = this.parameterSeed;
        this.includes.push(visitor);
      }
      visitor.Visit(item);

      if (visitor.select && visitor.select !== '*') {
        this.select += ((this.select && !this.select.trim().endsWith(',') ? ',' : '') + visitor.select);
      } else if (this.expands[expandPath]) {
        visitor.select = this.expands[expandPath];
      }
      this.parameterSeed = visitor.parameterSeed;
    });
  }

  protected VisitSelectItem(node: Token, context: any) {
    if (node.raw.includes('/')) {
      const item = node.raw.replace(/\//g, '.');
      this.select += item;
      const itemSplit = item.split('.');
      const itemName = itemSplit[0];
      this.expands[itemName] = this.expands[itemName] || '';
      this.expands[itemName] +=
        ((this.expands[itemName] && !this.expands[itemName].trim().endsWith(',') ? ',' : '') + item);
      return;
    }

    let item = node.raw.replace(/\//g, '.');
    this.select += this.getIdentifier(item, context.identifier);
  }

  protected VisitPropertyPathExpression(node: Token, context: any) {
    if (context.target === 'where' && node.value.current) {
      // if we're in a filtering context and get to this poinrt, we're dealing with a `relation/member`
      // We need to ensure that this relation is loaded into a Visitor
      let expandPath = node.value.current.value.name;
      let visitor = this.includes.filter(
        (v) => v.navigationProperty == expandPath
      )[0];
      if (!visitor) {
        visitor = new TypeOrmVisitor({ ...this.options, alias: expandPath });
        visitor.parameterSeed = this.parameterSeed;
        this.includes.push(visitor);
        visitor.Visit(node.value.current);
        // if the visitor never existed before, that means the relation hasn't been loaded with another Token. 
        // It's only used for filtering data, and thus doesn't need to return extra data
        visitor.where = '1 = 1';
        visitor.select = '';
        visitor.navigationProperty = expandPath;
      }
    }

    // Default implementation
    if (node.value.current && node.value.next) {
      this.Visit(node.value.current, context);
      context.identifier += '.';
      this.Visit(node.value.next, context);
    } else this.Visit(node.value, context);
  }

  protected VisitODataIdentifier(node: Token, context: any) {
    if (context.identifier && context.identifier.endsWith('.')) {
      this[context.target] += '.';
    }

    if (node.value.name === 'NULL') {
      this[context.target] += node.value.name;
    } else {
      const ident = this.getIdentifier(node.value.name, context);
      this[context.target] += ident
    }
    context.identifier = node.value.name;
  }

  private getIdentifier(originalIdentifier: string, context: any) {
    let alias = '';
    if (!context || !context.identifier || !context.identifier.endsWith('.')) {
      alias = this.alias + '.';
    } else {
      this[context.target] = this[context.target].replace(new RegExp(this.alias + '.' + context.identifier, 'g'), context.identifier)
    }
    return `${alias}${originalIdentifier}`;
  };

  protected VisitEqualsExpression(node: Token, context: any) {
    this.Visit(node.value.left, context);
    this.where += ' = ';
    this.Visit(node.value.right, context);
    if (this.options.useParameters && context.literal == null) {
      this.where = this.where.replace(/= :p\d*$/, 'IS NULL')
        .replace(new RegExp(`\\:p\\d* = ${context.identifier}$`),
          `${context.identifier} IS NULL`);
    } else if (context.literal == 'NULL') {
      this.where = this.where.replace(/= NULL$/, 'IS NULL')
        .replace(new RegExp(`NULL = ${context.identifier}$`), `${context.identifier} IS NULL`);
    }
  }

  protected VisitNotEqualsExpression(node: Token, context: any) {
    this.Visit(node.value.left, context);
    this.where += ' <> ';
    this.Visit(node.value.right, context);
    if (this.options.useParameters && context.literal == null) {
      this.where = this.where.replace(/<> :p\d*$/, 'IS NOT NULL')
        .replace(new RegExp(`\\:p\\d* <> ${context.identifier}$`),
          `${context.identifier} IS NOT NULL`);
    } else if (context.literal == 'NULL') {
      this.where = this.where.replace(/<> NULL$/, 'IS NOT NULL')
        .replace(new RegExp(`NULL <> ${context.identifier}$`), `${context.identifier} IS NOT NULL`);
    }
  }

  protected VisitLiteral(node: Token, context: any) {
    if (this.options.useParameters) {
      let name = `p${this.parameterSeed++}`;
      let value = Literal.convert(node.value, node.raw);
      context.literal = value;
      if (context.literal != null) {
        this.parameters.set(name, value);
      }
      this.where += `:${name}`;
    } else this.where += (context.literal = SQLLiteral.convert(node.value, node.raw));
  }

  protected VisitMethodCallExpression(node:Token, context:any){
    var method = node.value.method;
    var params = node.value.parameters || [];
    switch (method){
      case "contains":
        this.Visit(params[0], context);
        if (this.options.useParameters){
          let name = `p${this.parameterSeed++}`;
          let value = Literal.convert(params[1].value, params[1].raw);
          this.parameters.set(name, `%${value}%`);
          this.where += " like ?";
        }else this.where += ` like '%${SQLLiteral.convert(params[1].value, params[1].raw).slice(1, -1)}%'`;
        break;
      case "endswith":
        this.Visit(params[0], context);
        if (this.options.useParameters){
          let name = `p${this.parameterSeed++}`;
          let value = Literal.convert(params[1].value, params[1].raw);
          this.parameters.set(name, `%${value}`);
          this.where += " like ?";
        }else this.where += ` like '%${SQLLiteral.convert(params[1].value, params[1].raw).slice(1, -1)}'`;
        break;
      case "startswith":
        this.Visit(params[0], context);
        if (this.options.useParameters){
          let name = `p${this.parameterSeed++}`;
          let value = Literal.convert(params[1].value, params[1].raw);
          this.parameters.set(name, `${value}%`);
          this.where += " like ?";
        }else this.where += ` like '${SQLLiteral.convert(params[1].value, params[1].raw).slice(1, -1)}%'`;
        break;
      case "indexof":
        let fn = "";
        switch (this.type) {
          case SQLLang.MsSql:
            fn = "CHARINDEX";
            break;
          case SQLLang.ANSI:
          case SQLLang.MySql:
          case SQLLang.PostgreSql:
          default:
            fn = "INSTR";
            break;
        }
        if (fn === "CHARINDEX"){
          const tmp = params[0];
          params[0] = params[1];
          params[1] = tmp;
        }
        this.where += `${fn}(`;
        this.Visit(params[0], context);
        this.where += ', ';
        this.Visit(params[1], context);
        this.where += ") - 1";
        break;
      case "round":
        this.where += "ROUND(";
        this.Visit(params[0], context);
        this.where += ")";
        break;
      case "length":
        this.where += "LEN(";
        this.Visit(params[0], context);
        this.where += ")";
        break;
      case "tolower":
        this.where += "LOWER(";
        this.Visit(params[0], context);
        this.where += ")";
        break;
      case "toupper":
        this.where += "UPPER(";
        this.Visit(params[0], context);
        this.where += ")";
        break;
      case "floor":
      case "ceiling":
      case "year":
      case "month":
      case "day":
      case "hour":
      case "minute":
      case "second":
        this.where += `${method.toUpperCase()}(`;
        this.Visit(params[0], context);
        this.where += ")";
        break;
      case "now":
        this.where += "NOW()";
        break;
      case "trim":
        this.where += "TRIM(' ' FROM ";
        this.Visit(params[0], context);
        this.where += ")";
        break;
    }
  }

}
