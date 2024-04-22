import { Errors } from '@lensshare/data/errors';
import response from '@lensshare/lib/response';
import { createCors, error, Router, status } from 'itty-router';

import haveUsedHey from './handlers/haveUsedHey';
import profile from './handlers/profile';
import profileDetails from './handlers/profileDetails';
import profileImpressions from './handlers/profileImpressions';
import publicationViews from './handlers/publicationViews';
import streaksCalendar from './handlers/streaksCalendar';
import streaksList from './handlers/streaksList';
import buildRequest from './helpers/buildRequest';
import type { Env, WorkerRequest } from './types';

const { preflight} = createCors({
  origins: ['*'],
  methods: ['HEAD', 'GET', 'POST']
});

const router = Router();

router
  .all('*', preflight)
  .head('*', () => status(200))
  .get('/', (request: WorkerRequest) =>
    response({
      message: 'gm, to stats service 👋',
      version: request.env.RELEASE ?? 'unknown'
    })
  )
  .post('/publicationViews', publicationViews)
  .get('/profileImpressions', profileImpressions)
  .get('/profile', profile)
  .get('/profileDetails', profileDetails)
  .get('/haveUsedHey', haveUsedHey)
  .get('/streaksCalendar', streaksCalendar)
  .get('/streaksList', streaksList)
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
  
      .catch(() => {
        return error(500, Errors.InternalServerError);
      });
  }
};
