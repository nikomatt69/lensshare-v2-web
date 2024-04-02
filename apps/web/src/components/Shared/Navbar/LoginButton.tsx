import { Button } from '@lensshare/ui';
import type { FC } from 'react';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';

interface LoginButtonProps {
  isBig?: boolean;
}

const LoginButton: FC<LoginButtonProps> = ({ isBig = false }) => {
  const { setShowAuthModal } = useGlobalModalStateStore();

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
