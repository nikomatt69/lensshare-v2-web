import * as React from 'react';
import { useAddToHomescreenPrompt } from './useAddToHome';
import { ShareIcon, XCircleIcon } from '@heroicons/react/24/outline';


export function AddToHome() {
  const [prompt, promptToInstall] = useAddToHomescreenPrompt();
  const [isVisible, setVisibleState] = React.useState(false);

  const hide = () => setVisibleState(false);

  React.useEffect(() => {
    if (prompt) {
      setVisibleState(true);
    }
  }, [prompt]);

  if (!isVisible) {
    return <div />;
  }

  return (
    <div className="space-y-3" onClick={hide}>
      <button onClick={hide}>
        <XCircleIcon className="mx-3 h-4 w-4 text-blue-700" />{' '}
      </button>
      <button onClick={promptToInstall}>
        <ShareIcon className="h-4 w-4 text-blue-700" />{' '}
      </button>
    </div>
  );
}
export default AddToHome;
