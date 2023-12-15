import type { FC, ReactNode } from 'react';
import PushNotiProvider from './PushProvider';

interface PushProviderOkProps {
  children: ReactNode;
}

const PushProviderOk: FC<PushProviderOkProps> = ({ children }) => {
  return <PushNotiProvider>{children}</PushNotiProvider>;
};

export default PushProviderOk;