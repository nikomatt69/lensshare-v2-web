import type { FC } from 'react';


import { useRouter } from 'next/router';

import MetaTags from '../Common/MetaTags';
import { APP_NAME, DESCRIPTION } from '@lensshare/data/constants';

const PageMetatags: FC = () => {
  const { pathname } = useRouter();

  const getOg = () => {
    switch (pathname) {
      case '/explore': {
        return {
          description: `Explore top commented, collected and latest publications in the ${APP_NAME}.`,
          title: `Explore • ${APP_NAME}`
        };
      }
      case '/new/profile': {
        return {
          description: `Create new Lens profile on ${APP_NAME}.`,
          title: `Create Profile • ${APP_NAME}`
        };
      }
      case '/pro': {
        return {
          description: `${APP_NAME} Pro is a paid subscription that gives you access to more features and benefits.`,
          title: `Pro • ${APP_NAME}`
        };
      }
      case '/support': {
        return {
          description: `Contact ${APP_NAME} support team.`,
          title: `Support • ${APP_NAME}`
        };
      }
      case '/pro': {
        return {
          description: `${APP_NAME} Pro is a paid subscription that gives you access to more features and benefits.`,
          title: `Pro • ${APP_NAME}`
        };
      }
      case '/privacy': {
        return {
          description: `Privacy Policy of ${APP_NAME}.`,
          title: `Privacy Policy • ${APP_NAME}`
        };
      }
      case '/terms': {
        return {
          description: `Terms & Conditions of ${APP_NAME}.`,
          title: `Terms & Conditions • ${APP_NAME}`
        };
      }
      case '/thanks': {
        return {
          description: `Thanks to all the people and projects that have supported ${APP_NAME}.`,
          title: `Thanks • ${APP_NAME}`
        };
      }
      case '/thanks': {
        return {
          description: `Thanks to all the people and projects that have supported ${APP_NAME}.`,
          title: `Thanks • ${APP_NAME}`
        };
      }
      default: {
        return {
          description: DESCRIPTION,
          title: APP_NAME
        };
      }
    }
  };

  return <MetaTags description={getOg().description} title={getOg().title} />;
};

export default PageMetatags;
