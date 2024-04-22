import { Errors } from '@lensshare/data/errors';
import response from '@lensshare/lib/response';
import validateLensAccount from '@lensshare/lib/worker-middlewares/validateLensAccount';
import { createCors, error, Router, status } from 'itty-router';

import getHeyMemberNftStatus from './handlers/getHeyMemberNftStatus';
import getPreferences from './handlers/getPreferences';
import updateHeyMemberNftStatus from './handlers/updateHeyMemberNftStatus';
import updatePreferences from './handlers/updatePreferences';
import buildRequest from './helpers/buildRequest';
import type { Env, WorkerRequest } from './types';

const { preflight } = createCors({
  origins: ['*'],
  methods: ['HEAD', 'GET', 'POST']
});

const router = Router();

router
  .all('*', preflight)
  .head('*', () => status(200))
  .get('/', (request: WorkerRequest) =>
    response({
      message: 'gm, to preferences service 👋',
      version: request.env.RELEASE ?? 'unknown'
    })
  )
  .get('/getPreferences', getPreferences)
  .get('/getHeyMemberNftStatus', getHeyMemberNftStatus)
  .post('/updatePreferences', validateLensAccount, updatePreferences)
  .post(
    '/updateHeyMemberNftStatus',
    validateLensAccount,
    updateHeyMemberNftStatus
  )
  .all('*', () => error(404));

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const incomingRequest = buildRequest(request, env, ctx);

    return await router.handle(incomingRequest).catch(() => {
      return error(500, Errors.InternalServerError);
    });
  }
};
