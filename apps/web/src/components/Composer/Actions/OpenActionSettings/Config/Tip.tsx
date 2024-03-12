import type { Address } from 'viem';

import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { ADDRESS_PLACEHOLDER } from '@lensshare/data/constants';
import { VerifiedOpenActionModules } from '@lensshare/data/verified-openaction-modules';
import formatAddress from '@lensshare/lib/formatAddress';
import { Radio } from '@lensshare/ui';
import { type FC } from 'react';

import useProfileStore from 'src/store/persisted/useProfileStore';
import { useEffectOnce } from 'usehooks-ts';
import { encodeAbiParameters, isAddress } from 'viem';
import { create } from 'zustand';

import SaveOrCancel from '../SaveOrCancel';
import { useAppStore } from 'src/store/useAppStore';
import { useOpenActionStore } from 'src/store/non-persisted/useOpenActionStore';
import SearchProfiles from '../SearchProfiles';



interface TipActionState {
  enabled: boolean;
  recipient: string;
  reset: () => void;
  setEnabled: (enabled: boolean) => void;
  setRecipient: (recipient: string) => void;
}

const useTipActionStore = create<TipActionState>((set) => ({
  enabled: false,
  recipient: '',
  reset: () => set({ enabled: false, recipient: '' }),
  setEnabled: (enabled) => set({ enabled }),
  setRecipient: (recipient) => set({ recipient })
}));

const TipConfig: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const openAction = useOpenActionStore((state) => state.openAction);
  const setShowModal = useOpenActionStore((state) => state.setShowModal);
  const setOpenAction = useOpenActionStore((state) => state.setOpenAction);
  const { enabled, recipient, reset, setEnabled, setRecipient } =
    useTipActionStore();

  const isSelfTip = recipient === currentProfile?.ownedBy.address;

  useEffectOnce(() => {
    if (!openAction) {
      reset();
    }
  });

  const onSave = () => {
    setOpenAction({
      address: VerifiedOpenActionModules.Tip,
      data: encodeAbiParameters(
        [{ name: 'tipReceiver', type: 'address' }],
        [recipient as Address]
      )
    });
    setShowModal(false);
  };

  return (
    <>
      <div className="p-5">
        <ToggleWithHelper
          description="This will allow users to tip you on your post"
          heading="Enable tipping"
          on={enabled}
          setOn={() => {
            setEnabled(!enabled);
            setRecipient(enabled ? '' : currentProfile?.ownedBy.address);
            if (enabled) {
              reset();
            }
          }}
        />
      </div>
      {enabled && (
        <>
          <div className="divider" />
          <div className="p-5">
            <div className="space-y-3">
              <b>Recipient</b>
              <div className="space-y-5">
                <Radio
                  checked={isSelfTip}
                  description={formatAddress(currentProfile?.ownedBy.address)}
                  heading={<b>My wallet</b>}
                  onChange={() => {
                    setRecipient(currentProfile?.ownedBy.address);
                  }}
                />
                <Radio
                  checked={!isSelfTip}
                  heading={<b>Custom</b>}
                  onChange={() => {
                    setRecipient('');
                  }}
                />
                {!isSelfTip && (
                  <SearchProfiles
                    error={recipient.length > 0 && !isAddress(recipient)}
                    hideDropdown={isAddress(recipient)}
                    onChange={(event) => setRecipient(event.target.value)}
                    onProfileSelected={(profile) =>
                      setRecipient(profile.ownedBy.address)
                    }
                    placeholder={`${ADDRESS_PLACEHOLDER} or wagmi`}
                    value={recipient}
                  />
                )}
              </div>
            </div>
            <SaveOrCancel
              onSave={onSave}
              saveDisabled={recipient.length === 0 || !isAddress(recipient)}
            />
          </div>
        </>
      )}
    </>
  );
};

export default TipConfig;
