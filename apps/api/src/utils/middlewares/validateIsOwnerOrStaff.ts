import type { Request } from 'express';

import parseJwt from '@lensshare/lib/parseJwt';

import validateIsStaff from './validateIsStaff';

/**
 * Middleware to validate if the user is staff or the owner of the profile
 * @param request Incoming request
 * @param id Profile id
 * @returns Response
 */
const validateIsOwnerOrStaff = async (request: Request, id: string) => {
  const accessToken = request.headers['x-access-token'] as string;

  if (!accessToken) {
    return false;
  }

  try {
    const payload = parseJwt(accessToken);

    // Check if the user is staff or the owner of the profile
    if (payload.id !== id && !(await validateIsStaff(request))) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

export default validateIsOwnerOrStaff;
