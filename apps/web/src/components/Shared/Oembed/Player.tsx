import type { OG } from '@lensshare/types/misc';
import cn from '@lensshare/ui/cn';
import type { FC } from 'react';

interface PlayerProps {
  className?: string;
  og: OG;
}

const Player: FC<PlayerProps> = ({ className, og }) => {
  return (
    <div className={cn('mt-4 w-5/6 text-sm', className)}>
      <div
        className="oembed-player"
        dangerouslySetInnerHTML={{ __html: og.html as string }}
      />
    </div>
  );
};

export default Player;
