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
const executeQuery_1 = require("./executeQuery");
exports.executeQuery = executeQuery_1.executeQuery;
function odataQuery(repositoryOrQueryBuilder) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const alias = '';
            const result = yield executeQuery_1.executeQuery(repositoryOrQueryBuilder, req.query, { alias });
            return res.status(200).json(result);
        }
        catch (e) {
            console.log('ODATA ERROR', e);
            res.status(500).json({ message: 'Internal server error.', error: { message: e.message } });
        }
        return next();
    });
}
exports.odataQuery = odataQuery;
//# sourceMappingURL=odataQueryMiddleware.js.map