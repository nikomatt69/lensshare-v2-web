import Audio from '@components/Shared/Audio';
import type { MetadataAsset } from '@lensshare/types/misc';
import type { APITypes } from 'plyr-react';
import { useState, type FC, type Ref } from 'react';
import useEchoStore from 'src/store/echos';

interface MetadataAttachment {
  uri: string;
  type: 'Audio';
}
type Props = {

  asset?: MetadataAsset;
};

const Wrapper: FC<Props> = ({  asset }) => {
  const selectedTrack = useEchoStore((state) => state.selectedTrack);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  return (
    <>
      {' '}
      <div className="xs:mb-22 sm:mb-22 display:absolute mx-auto mb-10 h-full max-w-[100rem] md:mb-10 lg:mb-10">
 
        {selectedTrack && (
          <div className="z-999 xs:max-h-10 fixed bottom-14 left-0 right-0 z-[5] m-auto flex  items-center justify-around overflow-hidden rounded-lg  border-2 border-b-0 border-l border-r border-t border-blue-700 bg-white px-4 py-3 dark:bg-gray-800 lg:w-[1100px] xl:w-[1200px]">
            <Audio
              src={asset?.uri as string}
              poster={asset?.cover as string}
              artist={asset?.artist}
              title={asset?.title}
              expandCover={setExpandedImage}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Wrapper;
