import MetaTags from '@components/Common/MetaTags';

import { useRouter } from 'next/router';
import React from 'react';
import Custom500 from 'src/pages/500';

import Audio from './Audio';
import Background from './Background';
import type { AnyPublication } from '@lensshare/lens';
import { usePublicationQuery } from '@lensshare/lens';
import Loader from '@components/Shared/Loader';
import { getPublication } from 'src/hooks/getPublication';
import ListenModal from './SpacesWindow/ListenModal';

const Listen = () => {
  const {
    query: { id }
  } = useRouter();

  const { data, error, loading } = usePublicationQuery({
    variables: {
      request: { forId: id }
    },
    skip: !id
  });

  if (loading || !data) {
    return (
      <div className="grid hidden h-[80vh] place-items-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <Custom500 />;
  }

  const publication = data?.publication as AnyPublication;
  const audio = getPublication(publication);

  return (
    <>
      <MetaTags />
      {audio ? (
        <div className="m-1  mt-16">
          <Background audio={audio}>
            <Audio audio={audio} />
            <ListenModal publication={audio}/>
          </Background>
        </div>
      ) : (
        <ListenModal publication={audio}/>
      )}
    </>
  );
};

export default Listen;
