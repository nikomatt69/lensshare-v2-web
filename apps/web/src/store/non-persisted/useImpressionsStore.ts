import type { PublicationViewCount } from '@lensshare/types/hey';

import getPublicationsViews from '@lensshare/lib/getPublicationsViews';
import { create } from 'zustand';

interface ImpressionsState {
  fetchAndStoreViews: (ids: string[]) => void;
  publicationViews: PublicationViewCount[];
}

export const useImpressionsStore = create<ImpressionsState>((set) => ({
  fetchAndStoreViews: async (ids) => {
    if (!ids.length) {
      return;
    }

    const viewsResponse = await getPublicationsViews(ids);
    set((state) => ({
      publicationViews: [...state.publicationViews, ...viewsResponse]
    }));
  },
  publicationViews: []
}));
