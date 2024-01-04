import type { Profile, ProfilesRequest } from '@lensshare/lens';
import { useProfilesLazyQuery } from '@lensshare/lens';
import { useCallback, useState } from 'react';
import { usePushChatStore } from 'src/store/push-chat';

const useFetchLensProfiles = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const setLensProfiles = usePushChatStore((state) => state.setLensProfiles);
  const lensProfiles = usePushChatStore((state) => state.lensProfiles);

  const [loadProfiles] = useProfilesLazyQuery();

  const loadLensProfiles = useCallback(
    async (profilesChunk: Array<string>) => {
      try {
        setLoading(true);

        // Make the profileIds array unique using the Set data structure
        const uniqueProfileIds = Array.from(new Set(profilesChunk));

        const result = await loadProfiles({
          variables: {
            request: {
              where: { profileIds: uniqueProfileIds }
            } as ProfilesRequest
          }
        });
        if (result.data) {
          const lensIdsMap = new Map(
            result.data.profiles.items.map((profile) => {
              return [profile.id, profile as Profile];
            })
          );
          setLensProfiles(lensIdsMap);
          return lensIdsMap;
        }
      } catch (error: Error | any) {
        console.log(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [loadProfiles, setLensProfiles]
  );

  const getLensProfile = useCallback(
    async (profileId: string) => {
      try {
        setLoading(true);

        if (lensProfiles.get(profileId)) {
          return lensProfiles.get(profileId);
        } else {
          const lensIdMap = await loadLensProfiles([profileId]);
          return lensIdMap?.get(profileId);
        }
      } catch (error: Error | any) {
        console.log(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [lensProfiles, loadLensProfiles]
  );

  return { loadLensProfiles, getLensProfile, error, loading };
};

export default useFetchLensProfiles;
