import { Errors } from '@lensshare/data/errors';
import response from '@lensshare/lib/response';
import { createCors, error, Router, status } from 'itty-router';

import getImage from './handlers/getImage';
import getOembed from './handlers/getOembed';
import buildRequest from './helper/buildRequest';
import type { Env, WorkerRequest } from './types';

const { preflight, corsify } = createCors({
  origins: ['*'],
  methods: ['HEAD', 'GET']
});

const router = Router();

router
  .all('*', preflight)
  .head('*', () => status(200))
  .get('/', (request: WorkerRequest) =>
    response({
      message: 'gm, to oembed service 👋',
      version: request.env.RELEASE ?? 'unknown'
    })
  )
  .get('/oembed', getOembed)
  .get('/image', getImage)
  .all('*', () => error(404));

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const incomingRequest = buildRequest(request, env, ctx);

    return await router
      .handle(incomingRequest)
      .then(corsify)
      .catch(() => {
        return error(500, Errors.InternalServerError);
      });
  }
};
