import express from 'express';
import {odataQuery} from 'odata-v4-typeorm';
import {getConnection, getRepository} from 'typeorm';

import {Author} from './entities/author';
import {Post} from './entities/post';
import {PostCategory} from './entities/postCategory';
import {PostDetails} from './entities/postDetails';
import {DataFilling1577087002356} from './migrations/1577087002356-dataFilling';
import {createConnection} from './db/createConnection';
import config from './config';

export default (async () => {
  try {
    const dbConfig = config.db;
    await createConnection([
      Author,
      Post,
      PostCategory,
      PostDetails
    ], [DataFilling1577087002356], dbConfig);

    const app = express();

    // Posts
    const postsRepository = getRepository(Post);
    app.get('/api/posts/([\$])metadata', (res, req) => {
      const metadata = getConnection().getMetadata(Post).ownColumns.map(column => column.propertyName);
      return req.status(200).json(metadata)
    });
    app.get('/api/posts', odataQuery(postsRepository));

    // Authors
    const authorsRepository = getRepository(Author);
    app.get('/api/authors/([\$])metadata', (res, req) => {
      const metadata = getConnection().getMetadata(Author).ownColumns.map(column => column.propertyName);
      return req.status(200).json(metadata)
    });
    app.get('/api/authors', odataQuery(authorsRepository));

    const port = config.http.port;
    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
  } catch (e) {
    console.error(e, 'Start service error');
  }
})();
