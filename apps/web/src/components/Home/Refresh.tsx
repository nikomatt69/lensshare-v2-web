import MirrorOutline from '@components/Icons/MirrorOutline';
import React from 'react';


const RefreshButton = () => {
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <button onClick={refreshPage} className="mx-auto my-2 flex text-blue-700">
      Refresh <MirrorOutline className="mx-1 mt-1.5 h-4 w-4 text-blue-700 " />
    </button>
  );
};

export default RefreshButton;
