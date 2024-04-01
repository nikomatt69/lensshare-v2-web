// Strings used for events tracking

export const PAGEVIEW = 'Pageview';
export const AUTH = {
  LOGIN: 'User login',
  LOGOUT: 'User logout',
  SIWL: 'Sign in with Lens',
  CONNECT_WALLET: 'Connect wallet',
  CHANGE_WALLET: 'Change wallet'
};

export const MESSAGES = {
  ALLOW_USER: 'Allow user',
  BLOCK_USER: 'Block user',
  ENABLE_MESSAGES: 'Enable messages',
  OPEN_CONVERSATION: 'Open conversation',
  SEND_MESSAGE: 'Send message',
  START_CONVERSATION: 'Start conversation'
};


export const PROFILE = {
  FOLLOW: 'Follow profile',
  SUPER_FOLLOW: 'Super follow profile',
  UNFOLLOW: 'Unfollow profile',
  DISMISS_RECOMMENDED_PROFILE: 'Dismiss recommended profile',
  OPEN_SUPER_FOLLOW: 'Open super follow modal',
  OPEN_FOLLOWERS: 'Open followers modal',
  OPEN_FOLLOWING: 'Open following modal',
  COPY_PROFILE_LINK: 'Copy profile link',
  SWITCH_PROFILE_FEED_TAB: 'Switch profile feed tab',
  SWITCH_PROFILE_STATS_TAB: 'Switch profile stats tab',
  SWITCH_PROFILE: 'Switch profile',
  REPORT_PROFILE: 'Report profile',
  BLOCK: 'Block profile',
  UNBLOCK: 'Unblock profile',
  LOGOUT: 'Profile logout'
};

export const PUBLICATION = {
  NEW_POST: 'New post',
  NEW_COMMENT: 'New comment',
  NEW_QUOTE: 'New quote',
  LIKE: 'Like publication',
  UNLIKE: 'Unlike publication',
  MIRROR: 'Mirror publication',
  SHARE: 'Share publication',
  TRANSLATE: 'Translate publication',
  COPY_TEXT: 'Copy publication text',
  TOGGLE_BOOKMARK: 'Toggle publication bookmark',
  TOGGLE_NOT_INTERESTED: 'Toggle publication not interested',
  DELETE: 'Delete publication',
  REPORT: 'Report publication',
  CLICK_OEMBED: 'Click publication oembed',
  CLICK_HASHTAG: 'Click publication hashtag',
  CLICK_MENTION: 'Click publication mention',
  OPEN_LIKES: 'Open likes modal',
  OPEN_MIRRORS: 'Open mirrors modal',
  OPEN_QUOTES: 'Open quotes modal',
  OPEN_COLLECTORS: 'Open collectors modal',
  OPEN_GIFS: 'Open GIFs modal',
  ATTACHMENT: {
    IMAGE: {
      OPEN: 'Open image attachment'
    },
    AUDIO: {
      PLAY: 'Play audio',
      PAUSE: 'Pause audio'
    }
  },
  COLLECT_MODULE: {
    OPEN_COLLECT: 'Open collect modal',
    COLLECT: 'Collect publication',
    OPEN_UNISWAP: 'Open Uniswap'
  },
  WIDGET: {
    SNAPSHOT: {
      OPEN_CAST_VOTE: 'Snapshot: Open cast vote modal',
      VOTE: 'Snapshot: Vote'
    }
  },
  OPEN_ACTIONS: {
    DECENT: {
      OPEN_DECENT: 'Open decent.xyz open action modal',
      TIP: 'Execute decent.xyz open action'
    },
    ZORA_NFT: {
      OPEN_LINK: 'Open Zora link',
      OPEN_MINT: 'Open Zora mint modal',
      MINT: 'Mint Zora NFT'
    },
    BASEPAINT_NFT: {
      OPEN_LINK: 'Open BasePaint link',
      OPEN_OPENSEA_LINK: 'Open BasePaint OpenSea link',
      OPEN_MINT: 'Open BasePaint mint modal',
      MINT: 'Mint BasePaint NFT'
    },
    UNLONELY_CHANNEL: {
      OPEN_LINK: 'Open Unlonely Channel link'
    },
    UNLONELY_NFC: {
      OPEN_LINK: 'Open Unlonely NFC link'
    }
  }
};

export const NOTIFICATION = {
  SWITCH_NOTIFICATION_TAB: 'Switch notifications tab'
};

export const HOME = {
  SWITCH_FOLLOWING_FEED: 'Switch to following feed',
  SWITCH_HIGHLIGHTS_FEED: 'Switch to highlights feed',
  SELECT_USER_FEED: 'Select user feed',
  ALGORITHMS: {
    OPEN_ALGORITHMS: 'Open algorithms modal',
    TOGGLE_ALGORITHM: 'Toggle algorithm',
    SWITCH_ALGORITHMIC_FEED: 'Switch to algorithmic feed'
  }
};

export const EXPLORE = {
  SWITCH_EXPLORE_FEED_TAB: 'Switch explore feed tab',
  SWITCH_EXPLORE_FEED_FOCUS: 'Switch explore feed focus'
};

export const SETTINGS = {
  ACCOUNT: {
    SET_DEFAULT_PROFILE: 'Set default profile',
    SET_SUPER_FOLLOW: 'Set super follow'
  },
  PROFILE: {
    UPDATE: 'Update profile',
    SET_NFT_PICTURE: 'Set NFT profile picture',
    SET_PICTURE: 'Set profile picture',
    SET_STATUS: 'Set profile status',
    CLEAR_STATUS: 'Clear profile status'
  },
  PREFERENCES: {
    TOGGLE_HIGH_SIGNAL_NOTIFICATION_FILTER:
      'Toggle high signal notification filter',
      TOGGLE_IS_PRIDE: 'Toggle is pride',
      TOGGLE_PUSH_NOTIFICATIONS: 'Toggle push notifications'
  },
  MANAGER: {
    TOGGLE: 'Toggle lens manager',
    UPDATE: 'Update lens manager',
    ADD_MANAGER: 'Add profile manager',
    REMOVE_MANAGER: 'Remove profile manager'
  },
  ALLOWANCE: {
    TOGGLE: 'Toggle allowance'
  },
  SESSIONS: {
    REVOKE: 'Revoke session'
  },
  INTERESTS: {
    ADD: 'Add profile interest',
    REMOVE: 'Remove profile interest'
  },
  EXPORT: {
    PROFILE: 'Export profile',
    PUBLICATIONS: 'Export publications',
    NOTIFICATIONS: 'Export notifications',
    FOLLOWING: 'Export following',
    FOLLOWERS: 'Export followers'
  },
  DANGER: {
    PROTECT_PROFILE: 'Protect profile',
    UNPROTECT_PROFILE: 'Unprotect profile',
    DELETE_PROFILE: 'Delete profile'
  }
};

export const INVITE = {
  OPEN_INVITE: 'Open invite modal',
  INVITE: 'Invite address'
};

export const GARDENER = {
  TOGGLE_MODE: 'Toggle gardener mode',
  REPORT: 'Gardener report'
};

export const STAFFTOOLS = {
  TOGGLE_MODE: 'Toggle staff mode'
};

export const SYSTEM = {
  SWITCH_THEME: 'Switch theme',
  SWITCH_NETWORK: 'Switch network'
};

export const MISCELLANEOUS = {
  OPEN_RECOMMENDED_PROFILES: 'Open recommended profiles modal',
  OPEN_TRENDING_TAG: 'Open trending tag',
  SELECT_LOCALE: 'Select locale',
  OPEN_LENS_WAITLIST: 'Open Lens waitlist',
  OPEN_GITCOIN: 'Open Gitcoin',
  DISMISSED_MEMBERSHIP_NFT_BANNER: 'Dismissed membership NFT banner',
  FOOTER: {
    OPEN_DISCORD: 'Open Discord',
    OPEN_GITHUB: 'Open GitHub',
    OPEN_VERCEL: 'Open Vercel',
    OPEN_STATUS: 'Open status',
    OPEN_FEEDBACK: 'Open feedback',
    OPEN_TRANSLATE: 'Open translate',
    OPEN_DONATE: 'Open donate'
  }
};

export const ONBOARDING = {
  NAVIGATE_UPDATE_PROFILE: 'Navigate to update profile from onboarding',
  NAVIGATE_UPDATE_PROFILE_INTERESTS:
    'Navigate to update profile interests from onboarding'
};

// enums
export enum FollowUnfollowSource {
  WHO_TO_FOLLOW = 'who_to_follow',
  WHO_TO_FOLLOW_MODAL = 'who_to_follow_modal',
  LIKES_MODAL = 'likes_modal',
  MIRRORS_MODAL = 'mirrors_modal',
  QUOTES_MODAL = 'quotes_modal',
  COLLECTORS_MODAL = 'collectors_modal',
  FOLLOWERS_MODAL = 'followers_modal',
  FOLLOWING_MODAL = 'following_modal',
  MUTUAL_FOLLOWERS_MODAL = 'mutual_followers_modal',
  PUBLICATION_RELEVANT_PROFILES = 'publication_relevant_profiles',
  PROFILE_PAGE = 'profile_page',
  PROFILE_POPOVER = 'profile_popover',
  FOLLOW_DIALOG = 'follow_dialog'
}

export const ALL_EVENTS = {
  PAGEVIEW,
  ...AUTH,
  ...PROFILE,
  ...PUBLICATION,
  ...NOTIFICATION,
  ...HOME,
  ...EXPLORE,
  ...SETTINGS,
  ...INVITE,
  ...GARDENER,
  ...STAFFTOOLS,
  ...SYSTEM,
  ...MISCELLANEOUS,
  ...ONBOARDING
};
