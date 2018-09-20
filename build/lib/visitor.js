"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const odata_v4_literal_1 = require("odata-v4-literal");
const visitor_1 = require("odata-v4-sql/lib/visitor");
class TypeOrmVisitor extends visitor_1.Visitor {
    constructor(options = {}) {
        super(options);
        //parameters:any[] = [];
        this.includes = [];
        this.alias = 'typeorm_query';
        this.type = visitor_1.SQLLang.Oracle;
        this.alias = options.alias || this.alias;
    }
    from(table) {
        let sql = `SELECT ${this.select} FROM ${table} WHERE ${this.where} ORDER BY ${this.orderby}`;
        if (typeof this.skip == 'number')
            sql += ` OFFSET ${this.skip} ROWS`;
        if (typeof this.limit == 'number') {
            if (typeof this.skip != 'number')
                sql += ' OFFSET 0 ROWS';
            sql += ` FETCH NEXT ${this.limit} ROWS ONLY`;
        }
        return sql;
    }
    VisitExpand(node, context) {
        node.value.items.forEach((item) => {
            let expandPath = item.value.path.raw;
            let visitor = this.includes.filter(v => v.navigationProperty == expandPath)[0];
            if (!visitor) {
                visitor = new TypeOrmVisitor(this.options);
                visitor.parameterSeed = this.parameterSeed;
                this.includes.push(visitor);
            }
            visitor.Visit(item);
            this.parameterSeed = visitor.parameterSeed;
        });
    }
    VisitSelectItem(node, context) {
        let item = node.raw.replace(/\//g, '.');
        this.select += `${this.alias}.${item}`;
    }
    VisitODataIdentifier(node, context) {
        if (node.value.name === 'NULL') {
            this[context.target] += node.value.name;
        }
        else {
            this[context.target] += `${this.alias}.${node.value.name}`;
        }
        context.identifier = node.value.name;
    }
    VisitEqualsExpression(node, context) {
        this.Visit(node.value.left, context);
        this.where += ' = ';
        this.Visit(node.value.right, context);
        if (this.options.useParameters && context.literal == null) {
            this.where = this.where.replace(/= :p\d*$/, 'IS NULL')
                .replace(new RegExp(`\\:p\\d* = ${this.alias}.${context.identifier}$`), `${this.alias}.${context.identifier} IS NULL`);
        }
        else if (context.literal == 'NULL') {
            this.where = this.where.replace(/= NULL$/, 'IS NULL').replace(new RegExp(`NULL = ${this.alias}.${context.identifier}$`), `${this.alias}.${context.identifier} IS NULL`);
        }
    }
    VisitNotEqualsExpression(node, context) {
        this.Visit(node.value.left, context);
        this.where += ' <> ';
        this.Visit(node.value.right, context);
        if (this.options.useParameters && context.literal == null) {
            this.where = this.where.replace(/<> :p\d*$/, 'IS NOT NULL')
                .replace(new RegExp(`\\:p\\d* <> ${this.alias}.${context.identifier}$`), `${this.alias}.${context.identifier} IS NOT NULL`);
        }
        else if (context.literal == 'NULL') {
            this.where = this.where.replace(/<> NULL$/, 'IS NOT NULL').replace(new RegExp(`NULL <> ${this.alias}.${context.identifier}$`), `${this.alias}.${context.identifier} IS NOT NULL`);
        }
    }
    VisitLiteral(node, context) {
        if (this.options.useParameters) {
            let name = `p${this.parameterSeed++}`;
            let value = odata_v4_literal_1.Literal.convert(node.value, node.raw);
            context.literal = value;
            if (context.literal != null) {
                this.parameters.set(name, value);
            }
            this.where += `:${name}`;
        }
        else
            this.where += (context.literal = visitor_1.SQLLiteral.convert(node.value, node.raw));
    }
}
exports.TypeOrmVisitor = TypeOrmVisitor;
//# sourceMappingURL=visitor.js.map