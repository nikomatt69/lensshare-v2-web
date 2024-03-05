import type { FC } from 'react';

import { AUTH } from '@lensshare/data/tracking';
import { Button } from '@lensshare/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useGlobalModalStateStore } from 'src/store/useGlobalModalStateStore';
import { VERIFIED_CHANNELS } from '@lensshare/data/verifiedprofiles';

const SignupButton: FC = () => {
  const setShowAuthModal = useGlobalModalStateStore(
    (state) => state.setShowAuthModal
  );
  
  return (
    <Button
      onClick={() => {
        setShowAuthModal(true, 'signup');
      
      }}
      outline
      size="md"
      
    >
      Signup
    </Button>
  );
};

export default SignupButton;
