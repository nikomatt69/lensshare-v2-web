import Profile from '@components/Profile';
import { HANDLE_PREFIX } from '@lensshare/data/constants';
import type { PublicationsRequest } from '@lensshare/lens';
import {
  CustomFiltersType,
  LimitType,
  ProfileDocument,
  PublicationsDocument
} from '@lensshare/lens';
import { apolloClient } from '@lensshare/lens/apollo';
import type { GetServerSidePropsContext } from 'next';

export const config = {
  unstable_runtimeJS: false
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const handle = context.params?.handle;

  // Cache the response for 60 days
  context.res.setHeader('Cache-Control', 'public, max-age=5184000');

  if (!handle) {
    return {
      props: { data: null }
    };
  }

  const { data: profileData } = await apolloClient().query({
    query: ProfileDocument,
    variables: { request: { forHandle: `${HANDLE_PREFIX}${handle}` } }
  });

  if (profileData.profile) {
    const profileId = profileData.profile.id;

    const request: PublicationsRequest = {
      where: {
        from: profileId,
        customFilters: [CustomFiltersType.Gardeners]
      },
      limit: LimitType.TwentyFive
    };

    const { data: profilePublicationsData } = await apolloClient().query({
      query: PublicationsDocument,
      variables: { request }
    });

    return {
      props: {
        profile: profileData.profile,
        publications: profilePublicationsData.publications?.items
      }
    };
  }

  return {
    props: { profile: null, publications: null }
  };
}

export default Profile;
