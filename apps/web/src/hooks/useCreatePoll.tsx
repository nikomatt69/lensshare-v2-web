import { BASE_URL, IS_MAINNET } from '@lensshare/data/constants';
import getProfile from '@lensshare/lib/getProfile';
import axios from 'axios';
import { useAppStore } from 'src/store/useAppStore';
import { usePublicationStore } from 'src/store/usePublicationStore';

type CreatePollResponse = string;

const useCreatePoll = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const pollConfig = usePublicationStore((state) => state.pollConfig);
  const publicationContent = usePublicationStore(
    (state) => state.publicationContent
  );

  // TODO: use useCallback
  const createPoll = async (): Promise<CreatePollResponse> => {
    try {
      const response = await axios({
        url: `/api/createPoll`,
        method: 'POST',
        data: {
          title: `Poll by ${getProfile(currentProfile).slugWithPrefix}`,
          description: publicationContent,
          choices: pollConfig.choices,
          length: pollConfig.length
        }
      });

      return `${publicationContent}\n\n${response.data.snapshotUrl}`;
    } catch (error) {
      throw error;
    }
  };

  return createPoll;
};

export default useCreatePoll;
