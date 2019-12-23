"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const createQuery_1 = require("./createQuery");
const mapToObject = (aMap) => {
    const obj = {};
    if (aMap) {
        aMap.forEach((v, k) => {
            obj[k] = v;
        });
    }
    return obj;
};
const queryToOdataString = (query) => {
    let result = '';
    for (let key in query) {
        if (key.startsWith('$')) {
            if (result !== '') {
                result += '&';
            }
            result += `${key}=${query[key]}`;
        }
    }
    return result;
};
const processIncludes = (queryBuilder, odataQuery, alias) => {
    if (odataQuery.includes && odataQuery.includes.length > 0) {
        odataQuery.includes.forEach(item => {
            debugger;
            const join = item.select === '*' ? 'leftJoinAndSelect' : 'leftJoin';
            queryBuilder = queryBuilder[join](
            //queryBuilder = queryBuilder.leftJoinAndSelect(
            (alias ? alias + '.' : '') + item.navigationProperty, item.navigationProperty, item.where.replace(/typeorm_query/g, item.navigationProperty), mapToObject(item.parameters));
            if (item.orderby && item.orderby != '1') {
                const orders = item.orderby.split(',').map(i => i.trim().replace(/typeorm_query/g, item.navigationProperty));
                orders.forEach((itemOrd) => {
                    queryBuilder = queryBuilder.addOrderBy(...(itemOrd.split(' ')));
                });
            }
            if (item.includes && item.includes.length > 0) {
                processIncludes(queryBuilder, { includes: item.includes }, item.navigationProperty);
            }
        });
    }
    return queryBuilder;
};
const executeQueryByQueryBuilder = (inputQueryBuilder, query, options) => __awaiter(this, void 0, void 0, function* () {
    const alias = inputQueryBuilder.expressionMap.mainAlias.name;
    //const filter = createFilter(query.$filter, {alias: alias});
    let odataQuery = {};
    if (query) {
        const odataString = queryToOdataString(query);
        if (odataString) {
            odataQuery = createQuery_1.createQuery(odataString, { alias: alias });
        }
    }
    let queryBuilder = inputQueryBuilder;
    queryBuilder = queryBuilder
        .andWhere(odataQuery.where)
        .setParameters(mapToObject(odataQuery.parameters));
    if (odataQuery.select && odataQuery.select != '*') {
        queryBuilder = queryBuilder.select(odataQuery.select.split(',').map(i => i.trim()));
    }
    queryBuilder = processIncludes(queryBuilder, odataQuery, alias);
    if (odataQuery.orderby && odataQuery.orderby !== '1') {
        const orders = odataQuery.orderby.split(',').map(i => i.trim());
        orders.forEach((item) => {
            queryBuilder = queryBuilder.addOrderBy(...(item.split(' ')));
        });
    }
    queryBuilder = queryBuilder.skip(query.$skip || 0);
    if (query.$top) {
        queryBuilder = queryBuilder.take(query.$top);
    }
    if (query.$count && query.$count !== 'false') {
        const resultData = yield queryBuilder.getManyAndCount();
        return {
            items: resultData[0],
            count: resultData[1]
        };
    }
    return queryBuilder.getMany();
});
const executeQuery = (repositoryOrQueryBuilder, query, options) => __awaiter(this, void 0, void 0, function* () {
    options = options || {};
    const alias = options.alias || '';
    let queryBuilder = null;
    // check that input object is query builder
    if (typeof repositoryOrQueryBuilder.expressionMap !== 'undefined') {
        queryBuilder = repositoryOrQueryBuilder;
    }
    else {
        queryBuilder = repositoryOrQueryBuilder.createQueryBuilder(alias);
    }
    const result = yield executeQueryByQueryBuilder(queryBuilder, query, { alias });
    return result;
});
exports.executeQuery = executeQuery;
//# sourceMappingURL=executeQuery.js.map