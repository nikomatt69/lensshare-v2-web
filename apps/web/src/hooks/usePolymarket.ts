import axios from 'axios';
import { useAppStore } from 'src/store/persisted/useAppStore';
import { usePublicationStore } from 'src/store/non-persisted/usePublicationStore';
import getProfile from '@lensshare/lib/getProfile';

const usePolymarket = () => {
  const { currentProfile } = useAppStore();
  const { marketConfig } = usePublicationStore(); // Assuming marketConfig includes relevant market settings

  const createMarket = async () => {
    try {
      const profile = getProfile(currentProfile);
      const response = await axios.post('/api/polymarket', {
        creator: currentProfile?.ownedBy.address,
        question: marketConfig.question,
        outcomes: marketConfig.outcomes,
        endTime: marketConfig.endTime // Example additional data
      });

      return response.data.questionId; // Assuming the response includes the Ethereum transaction hash
    } catch (error) {
      console.error('Error creating market:', error);
      throw new Error('Failed to create market');
    }
  };

  return createMarket;
};

export default usePolymarket;