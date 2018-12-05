"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const visitor_1 = require("./visitor");
const odata_v4_parser_1 = require("odata-v4-parser");
const odata_v4_sql_1 = require("odata-v4-sql");
function createFilter(odataFilter, options = {}) {
    console.log('OPTIONS', options);
    options.type = odata_v4_sql_1.SQLLang.Oracle;
    let ast = (typeof odataFilter == 'string' ? odata_v4_parser_1.filter(odataFilter) : odataFilter);
    const visitor = new visitor_1.TypeOrmVisitor(options);
    console.log('VISITOR', visitor);
    const visit = visitor.Visit(ast);
    console.log('VISIT', visit);
    const type = visit.asType();
    console.log('TYPE', type);
    return type;
}
exports.createFilter = createFilter;
//# sourceMappingURL=createFilter.js.map