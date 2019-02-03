"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const visitor_1 = require("./visitor");
const odata_v4_parser_1 = require("odata-v4-parser");
const odata_v4_sql_1 = require("odata-v4-sql");
function createFilter(odataFilter, options = {}) {
    options.type = odata_v4_sql_1.SQLLang.Oracle;
    let ast = (typeof odataFilter == 'string' ? odata_v4_parser_1.filter(odataFilter) : odataFilter);
    const visitor = new visitor_1.TypeOrmVisitor(options);
    const visit = visitor.Visit(ast);
    const type = visit.asType();
    return type;
}
exports.createFilter = createFilter;
//# sourceMappingURL=createFilter.js.map