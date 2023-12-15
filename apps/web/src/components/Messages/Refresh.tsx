import MirrorOutline from '@components/Icons/MirrorOutline';
import React from 'react';

const RefreshMessages = () => {
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <button onClick={refreshPage} className="mx-auto  flex text-blue-700">
      <MirrorOutline className="5 mx-2 h-5 w-5 font-bold   text-blue-700 " />
    </button>
  );
};

export default RefreshMessages;
