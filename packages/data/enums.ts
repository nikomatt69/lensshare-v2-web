export enum HomeFeedType {
  ALGO = 'ALGO',
  FOLLOWING = 'FOLLOWING',
  HIGHLIGHTS = 'HIGHLIGHTS',
  PREMIUM ='PREMIUM',
  // Thirdparty Algorithms
  K3L_RECENT = 'K3L_RECENT',
  K3L_RECOMMENDED = 'K3L_RECOMMENDED',
  K3L_POPULAR = 'K3L_POPULAR',
  K3L_CROWDSOURCED = 'K3L_CROWDSOURCED',
  K3L_FOLLOWING = 'K3L_FOLLOWING',
  HEY_MOSTVIEWED = 'HEY_MOSTVIEWED',
  HEY_MOSTINTERACTED = 'HEY_MOSTINTERACTED'
}

export const AlgorithmProvider = {
  K3L: 'k3l',
  HEY: 'hey'
};

export enum OpenAction {
  Tip = 'Tip',
  DecentNft = 'DecentNft',
  Swap = 'Swap',
  Polymarket = 'Polymarket'
}
