import { executeQuery } from './executeQuery';
interface OdataQuerySettings {
    logger?: {
        error: (text: string, data: any) => void;
    };
}
/**
 * Odata express middleware
 * @param repositoryOrQueryBuilder - typeorm repository or query builder
 * @param {OdataQuerySettings} settings - settings [optional]
 */
declare function odataQuery(repositoryOrQueryBuilder: any, settings?: OdataQuerySettings): (req: any, res: any, next: any) => Promise<any>;
export { odataQuery, executeQuery };
