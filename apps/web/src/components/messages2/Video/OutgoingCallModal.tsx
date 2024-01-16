import { VideoCallStatus } from '@pushprotocol/restapi';
import { useEffect } from 'react';
import { usePushChatStore } from 'src/store/push-chat';
import { Modal, Image } from '@lensshare/ui';
import usePushVideoCall from './usePushVideoCall';
import ProfileInfo from './ProfileInfo';
import { getProfileFromDID } from './helper';
import Video from './Video';
import MediaToggleButton from './MediaToggleButton';
import CallButton from './CallButton';

const OutgoingCallModal = () => {
  const connectedProfile = usePushChatStore((state) => state.connectedProfile);
  const selectedChatId = usePushChatStore((state) => state.selectedChatId);
  const localDid = connectedProfile?.did;

  const videoCallData = usePushChatStore((state) => state.videoCallData);
  const localStream = videoCallData.local.stream;
  const isLocalVideoOn = videoCallData.local.video;
  const isLocalAudioOn = videoCallData.local.audio;
  const isModalVisible =
    videoCallData.incoming[0].status === VideoCallStatus.INITIALIZED;

  const {
    createMediaStream,
    requestVideoCall,
    disconnectVideoCall,
    toggleAudio,
    toggleVideo
  } = usePushVideoCall();

  useEffect(() => {
    (async () => {
      if (isModalVisible) {
        if (localStream === null) {
          await createMediaStream();
        } else {
          await requestVideoCall({});
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStream, isModalVisible]);

  return (
    <Modal size="md" show={isModalVisible}>
      <div className="m-0 my-0 sm:my-4 md:my-4">
        <span className="absolute left-0 right-0 top-8 m-auto flex items-center justify-center sm:static md:static">
          <div className="mb-2 flex items-center rounded-lg bg-[#F4F4F5] px-2 py-0.5 dark:bg-[#18181B] sm:p-2 md:p-2">
            <Image
              className="mr-2 flex h-4 dark:hidden"
              src="/push/lock.svg"
              alt="lock"
            />
            <Image
              className="mr-2 hidden h-4 dark:flex"
              src="/push/lockdark.svg"
              alt="lock"
            />
            <span className="text-[10px] text-[#9E9EA9] dark:text-white sm:text-[13px] md:text-[15px]">
              End-to-end encrypted
            </span>
          </div>
        </span>
        <div className="absolute left-0 right-0 top-16 z-50 m-auto mt-2 flex items-center justify-center sm:static sm:flex md:static md:flex">
          <ProfileInfo profile={getProfileFromDID(selectedChatId)} />
        </div>
        <span className="absolute left-0 right-0 top-[130px] m-auto mb-2 mt-2 flex items-center justify-center text-[15px] sm:static sm:flex md:static md:flex">
          Calling...
        </span>
        <div>
          <Video
            isVideoOn={isLocalVideoOn}
            stream={localStream}
            profile={getProfileFromDID(localDid!)}
            isMainFrame={true}
            videoFramestyles="bg-black h-[87vh] sm:w-[95%] md:w-[95%] w-[100%] rounded-2xl object-cover sm:block sm:h-[57vh] md:h-[57vh]"
          />
        </div>
        <div className="absolute bottom-3 left-0 right-0 m-auto mb-8 mt-4 flex items-center justify-center gap-2.5 sm:static md:static">
          <MediaToggleButton
            iconSrc={`/push/${
              isLocalVideoOn ? 'cameraonbtn' : 'cameraoffbtn'
            }.svg`}
            styles={`bg-${isLocalVideoOn ? 'white' : '[red]'} border-${
              isLocalVideoOn ? '[#D4D4D8]' : 'none'
            }`}
            onClick={toggleVideo}
          />
          <MediaToggleButton
            iconSrc={`/push/${isLocalAudioOn ? 'miconbtn' : 'micoffbtn'}.svg`}
            styles={`bg-${isLocalAudioOn ? 'white' : '[red]'} border-${
              isLocalAudioOn ? '[#D4D4D8]' : 'none'
            }`}
            onClick={toggleAudio}
          />
          <CallButton
            iconSrc={'/push/callendbtn.svg'}
            styles="px-[28px] w-[80px] bg-[red]"
            onClick={disconnectVideoCall}
          />
        </div>
      </div>
    </Modal>
  );
};

export default OutgoingCallModal;
