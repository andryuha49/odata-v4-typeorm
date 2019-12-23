import {executeQuery} from './executeQuery';

function odataQuery(repositoryOrQueryBuilder: any, settings: {logger?: {error: (text: string, data: any) => void}} = {}) {
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