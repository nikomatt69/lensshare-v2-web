import getProfile from '@lensshare/lib/getProfile';
import axios from 'axios';
import { usePublicationStore } from 'src/store/non-persisted/usePublicationStore';
import { useAppStore } from 'src/store/persisted/useAppStore';

type CreatePollResponse = string;

const useCreatePoll = () => {
  const { currentProfile } = useAppStore();
  const { pollConfig, publicationContent } = usePublicationStore();

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
