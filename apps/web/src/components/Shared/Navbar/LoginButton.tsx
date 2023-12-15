import { AUTH } from '@lensshare/data/tracking';
import { Button } from '@lensshare/ui';
import { Leafwatch } from '@lib/leafwatch';
import type { FC } from 'react';
import { useGlobalModalStateStore } from 'src/store/useGlobalModalStateStore';

interface LoginButtonProps {
  isBig?: boolean;
}

const LoginButton: FC<LoginButtonProps> = ({ isBig = false }) => {
  const setShowAuthModal = useGlobalModalStateStore(
    (state) => state.setShowAuthModal
  );

  return (
    <Button
      size={isBig ? 'lg' : 'md'}
      icon={
        <img
          className="mr-0.5 h-3"
          height={12}
          src="/lens.svg"
          alt="Lens Logo"
        />
      }
      onClick={() => {
        setShowAuthModal(true);

      }}
    >
      Login
    </Button>
  );
};

export default LoginButton;
