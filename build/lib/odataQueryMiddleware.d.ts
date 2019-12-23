import { executeQuery } from './executeQuery';
declare function odataQuery(repositoryOrQueryBuilder: any, settings?: {
    logger?: {
        error: (text: string, data: any) => void;
    };
}): (req: any, res: any, next: any) => Promise<any>;
export { odataQuery, executeQuery };
