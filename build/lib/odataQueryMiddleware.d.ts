import { executeQuery } from './executeQuery';
declare function odataQuery(repositoryOrQueryBuilder: any): (req: any, res: any, next: any) => Promise<any>;
export { odataQuery, executeQuery };
