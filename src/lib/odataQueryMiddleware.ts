import {executeQuery} from './executeQuery';

interface OdataQuerySettings {
  logger?: {
    error: (text: string, data: any) => void
  }
}

/**
 * Odata express middleware
 * @param repositoryOrQueryBuilder - typeorm repository or query builder
 * @param {OdataQuerySettings} settings - settings [optional]
 */
function odataQuery(repositoryOrQueryBuilder: any, settings: OdataQuerySettings = {}) {
  return async (req: any, res: any, next) => {
    try {
      const alias = '';

      const result = await executeQuery(repositoryOrQueryBuilder, req.query, {alias});
      return res.status(200).json(result);
    } catch (e) {
      if (settings && typeof settings.logger !== 'undefined') {
        settings.logger.error('ODATA ERROR',e);
      } else {
        console.error('ODATA ERROR', e);
      }
      res.status(500).json({message: 'Internal server error.', error: {message: e.message}});
    }
    return next();
  }
}

export {odataQuery, executeQuery};