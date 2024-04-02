import type { PublicationViewCount } from '@lensshare/types/hey';

import getPublicationsViews from '@lensshare/lib/getPublicationsViews';
import { create } from 'zustand';
import { createTrackedSelector } from 'react-tracked';

interface State {
  fetchAndStoreViews: (ids: string[]) => void;
  publicationViews: PublicationViewCount[];
}

const store = create<State>((set) => ({
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

export const useImpressionsStore = createTrackedSelector(store);
