declare const executeQuery: (repositoryOrQueryBuilder: any, query: any, options: any) => Promise<any>;
declare function odataQuery(repositoryOrQueryBuilder: any): (req: any, res: any, next: any) => Promise<any>;
export { odataQuery, executeQuery };
