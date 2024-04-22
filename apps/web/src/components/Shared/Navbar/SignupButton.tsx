import type { FC } from 'react';

import { Button } from '@lensshare/ui';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';

const SignupButton: FC = () => {
  const { setShowAuthModal } = useGlobalModalStateStore();

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
