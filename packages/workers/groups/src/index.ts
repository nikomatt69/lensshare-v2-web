import { Errors } from '@lensshare/data/errors';
import response from '@lensshare/lib/response';
import { createCors, error, Router, status } from 'itty-router';

import featuredGroups from './handlers/featuredGroups';
import getGroup from './handlers/getGroup';
import buildRequest from './helpers/buildRequest';
import type { Env, WorkerRequest } from './types';

const { preflight, corsify } = createCors({
  origins: ['*'],
  methods: ['HEAD', 'GET', 'POST']
});

const router = Router();

router
  .all('*', preflight)
  .head('*', () => status(200))
  .get('/', (request: WorkerRequest) =>
    response({
      message: 'gm, to groups service 👋',
      version: request.env.RELEASE ?? 'unknown'
    })
  )
  .get('/get/:slug', getGroup)
  .get('/featured', featuredGroups)
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
