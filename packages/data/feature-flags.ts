export enum FeatureFlag {
  Flagged = 'flagged',
  Gardener = 'gardener',
  GardenerMode = 'gardener-mode',
  LensTeam = 'lens-team',
  Staff = 'staff',
  StaffMode = 'staff-mode',
  StaffPick = 'staff-pick',
  Suspended = 'suspended',
  Verified = 'verified'
}

export const featureFlags = [
  {
    key: FeatureFlag.Staff,
    enabledFor: ['0x933b']
  }
];
