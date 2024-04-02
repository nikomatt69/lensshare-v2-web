import type { Profile } from '@lensshare/lens';

import { create } from 'zustand';

import { createTrackedSelector } from 'react-tracked';

export type AuthModalType = 'login' | 'signup';

interface State {
  authModalType: AuthModalType;
  reportingProfile: null | Profile;
  reportingPublicationId: null | string;
  setShowAuthModal: (
    showAuthModal: boolean,
    authModalType?: AuthModalType
  ) => void;
  setShowDiscardModal: (showDiscardModal: boolean) => void;
  setShowInvitesModal: (showInvitesModal: boolean) => void;
  setShowMobileDrawer: (showMobileDrawer: boolean) => void;
  setShowNewPostModal: (showNewPostModal: boolean) => void;
  setShowOptimisticTransactionsModal: (
    showOptimisticTransactionsModal: boolean
  ) => void;
  setShowProfileSwitchModal: (showProfileSwitchModal: boolean) => void;
  setShowPublicationReportModal: (
    showPublicationReportModal: boolean,
    reportingPublicationId: null | string
  ) => void;
  setShowReportProfileModal: (
    reportProfileModal: boolean,
    reportingProfile: null | Profile
  ) => void;
  setShowWrongNetworkModal: (showWrongNetworkModal: boolean) => void;
  showAuthModal: boolean;
  showDiscardModal: boolean;
  showInvitesModal: boolean;
  showMobileDrawer: boolean;
  showNewPostModal: boolean;
  showOptimisticTransactionsModal: boolean;
  showProfileSwitchModal: boolean;
  showPublicationReportModal: boolean;
  showReportProfileModal: boolean;
  showWrongNetworkModal: boolean;
}

const store = create<State>((set) => ({
  authModalType: 'login',
  reportingProfile: null,
  reportingPublicationId: null,
  setShowAuthModal: (showAuthModal, authModalType) => {
    set(() => ({ authModalType, showAuthModal }));
  },
  setShowDiscardModal: (showDiscardModal) => set(() => ({ showDiscardModal })),
  setShowInvitesModal: (showInvitesModal) => set(() => ({ showInvitesModal })),
  setShowMobileDrawer: (showMobileDrawer) => set(() => ({ showMobileDrawer })),
  setShowNewPostModal: (showNewPostModal) => set(() => ({ showNewPostModal })),
  setShowOptimisticTransactionsModal: (showOptimisticTransactionsModal) =>
    set(() => ({ showOptimisticTransactionsModal })),
  setShowProfileSwitchModal: (showProfileSwitchModal) =>
    set(() => ({ showProfileSwitchModal })),
  setShowPublicationReportModal: (
    showPublicationReportModal,
    reportingPublicationId
  ) =>
    set(() => ({
      reportingPublicationId,
      showPublicationReportModal
    })),
  setShowReportProfileModal: (showReportProfileModal, reportingProfile) =>
    set(() => ({ reportingProfile, showReportProfileModal })),
  setShowWrongNetworkModal: (showWrongNetworkModal) =>
    set(() => ({ showWrongNetworkModal })),
  showAuthModal: false,
  showDiscardModal: false,
  showInvitesModal: false,
  showMobileDrawer: false,
  showNewPostModal: false,
  showOptimisticTransactionsModal: false,
  showProfileSwitchModal: false,
  showPublicationReportModal: false,
  showReportProfileModal: false,
  showWrongNetworkModal: false
}));

export const useGlobalModalStateStore = createTrackedSelector(store);
