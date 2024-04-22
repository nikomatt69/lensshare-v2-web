import { type Maybe, type OpenActionModule } from '@lensshare/lens';
import allowedOpenActionModules from './allowedOpen (1)';



const isOpenActionAllowed = (
  openActions?: Maybe<OpenActionModule[]>
): boolean => {
  if (!openActions?.length) {
    return false;
  }

  return openActions.some((openAction) => {
    const { type } = openAction;

    return allowedOpenActionModules.includes(type);
  });
};

export default isOpenActionAllowed;
