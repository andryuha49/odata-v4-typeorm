"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const visitor_1 = require("./visitor");
const odata_v4_parser_1 = require("odata-v4-parser");
const odata_v4_sql_1 = require("odata-v4-sql");
function createFilter(odataFilter, options = {}) {
    options.type = odata_v4_sql_1.SQLLang.Oracle;
    let ast = (typeof odataFilter == 'string' ? odata_v4_parser_1.filter(odataFilter) : odataFilter);
    return new visitor_1.TypeOrmVisitor(options).Visit(ast).asType();
}
exports.createFilter = createFilter;
//# sourceMappingURL=createFilter.js.map