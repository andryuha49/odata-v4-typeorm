import express from 'express';
import { odataQuery } from 'odata-v4-typeorm';
import { getRepository } from 'typeorm';
import { Author } from './entities/author';
import { Post } from './entities/post';
import { PostCategory } from './entities/postCategory';
import { PostDetails } from './entities/postDetails';
import {createConnection} from './createConnection';
import config from './config';

export default (async () => {
  try {
    const dbConfig = config.db;
    await createConnection([
      Author,
      Post,
      PostCategory,
      PostDetails
    ], [], dbConfig);

    const app = express();

    const postRepository = getRepository(Post);
    app.get('/api/posts', odataQuery(postRepository));

    const port = config.http.port;
    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
  } catch (e) {
    console.error(e, 'Start service error');
  }
})();
