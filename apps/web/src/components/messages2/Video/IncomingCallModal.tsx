/* eslint-disable react/jsx-no-undef */

import { VideoCallStatus } from '@pushprotocol/restapi';
import { useEffect, useRef, useState } from 'react';
import { usePushChatStore } from 'src/store/push-chat';
import usePushVideoCall from './usePushVideoCall';
import ProfileInfo from './ProfileInfo';
import CallButton from './CallButton';
import { Modal } from '@lensshare/ui';
import Video from './Video';
import { getProfileFromDID } from './helper';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useOnClickOutside } from 'usehooks-ts';

const IncomingCallModal = () => {
  const downRef = useRef(null);

  const connectedProfile = usePushChatStore((state) => state.connectedProfile);
  const localDid = connectedProfile?.did;

  const videoCallData = usePushChatStore((state) => state.videoCallData);
  const currentStatus = videoCallData.incoming[0].status;
  const isModalVisible = currentStatus === VideoCallStatus.RECEIVED;
  const localStream = videoCallData.local.stream;
  const isVideoOn = videoCallData.local.video;

  const { createMediaStream, acceptVideoCallRequest, disconnectVideoCall } =
    usePushVideoCall();

  const [isIncomingCallMinimized, setIsIncomingCallMinimized] = useState(false);

  useOnClickOutside(downRef, () => setIsIncomingCallMinimized(true));

  const minimizeCallHandler = () => {
    setIsIncomingCallMinimized(true);
  };

  useEffect(() => {
    (async () => {
      if (isModalVisible && localStream === null) {
        await createMediaStream();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStream, isModalVisible]);

  // reset the minimize state once the call has been connected
  useEffect(() => {
    if (currentStatus === VideoCallStatus.UNINITIALIZED) {
      setIsIncomingCallMinimized(false);
    }
  }, [currentStatus]);

  return (
    <div>
      {isModalVisible && isIncomingCallMinimized ? (
        <div className="xs:w-fit absolute bottom-[14%] left-0 right-0 z-50 ml-auto mr-auto box-border w-11/12 rounded-[24px] bg-[#F4F4F5] dark:border dark:border-[#3F3F46] dark:bg-[#18181B] md:bottom-28 md:left-auto md:right-[10%] md:m-0 md:ml-1 md:mr-1 md:w-fit lg:bottom-32 lg:right-4">
          <div className="flex flex-row items-center gap-8 p-4">
            <div className="">
              <ProfileInfo
                status={'Incoming Video Call'}
                removeSlug={true}
                profile={getProfileFromDID(videoCallData.incoming[0].address)}
              />
            </div>

            <div className="flex flex-row items-center justify-center gap-2">
              <CallButton
                styles="px-[13px] md:px-[17px] w-[47px] md:w-[60px] bg-[#30CC8B] rounded-[16px]"
                iconSrc={'/push/callacceptbtn.svg'}
                onClick={() => acceptVideoCallRequest({})}
              />
              <CallButton
                styles="px-[13px] md:px-[17px] w-[47px] md:w-[60px] bg-[red] rounded-[16px]"
                iconSrc={'/push/callendbtn.svg'}
                onClick={disconnectVideoCall}
              />
            </div>
          </div>
        </div>
      ) : (
        <Modal size="sm" show={isModalVisible}>
          <div ref={downRef} className="my-4 px-6">
            <div className="mt-8 flex w-full justify-end">
              <PlusIcon
                color={'#82828A'}
                className="mr-0 cursor-pointer dark:text-[#D4D4D8]"
                onClick={minimizeCallHandler}
              />
            </div>
            <div className="mb-4 mt-2 w-fit sm:justify-start">
              <ProfileInfo
                status={'Incoming Video Call'}
                profile={getProfileFromDID(videoCallData.incoming[0].address)}
              />
            </div>
            <div>
              <Video
                isVideoOn={isVideoOn}
                stream={localStream}
                profile={getProfileFromDID(localDid!)}
                isMainFrame={true}
                videoFramestyles="bg-black h-[50vh] w-[100%] rounded-2xl object-cover sm:block sm:h-[240px] md:h-[240px]"
              />
            </div>
            <div className="mt-4 flex w-full flex-row items-center justify-center gap-4">
              <CallButton
                styles="px-[28px] w-[80px] bg-[#30CC8B] rounded-[16px]"
                iconSrc={'/push/callacceptbtn.svg'}
                onClick={() => acceptVideoCallRequest({})}
              />
              <CallButton
                styles="px-[22px] w-[70px] bg-[red] rounded-[16px]"
                iconSrc={'/push/callendbtn.svg'}
                onClick={disconnectVideoCall}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default IncomingCallModal;
