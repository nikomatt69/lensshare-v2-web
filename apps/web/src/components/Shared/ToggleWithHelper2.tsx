import { Toggle2 } from "@lensshare/ui/src/Toggle2";
import { FC, ReactNode } from "react";

interface ToggleWithHelperProps {
  description: ReactNode;
  disabled?: boolean;
  heading?: ReactNode;
  icon?: ReactNode;
  on: boolean;
  setOn: (on: boolean) => void;
}

const ToggleWithHelper: FC<ToggleWithHelperProps> = ({
  description,
  disabled,
  heading,
  icon,
  on,
  setOn
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        {icon ? <span className="text-brand-500">{icon}</span> : null}
        {heading ? <span>{heading}</span> : null}
      </div>
      <div className="flex items-center space-x-2">
        <Toggle2 disabled={disabled} on={on} setOn={setOn} />
        <div className="ld-text-gray-500 text-sm font-bold">{description}</div>
      </div>
    </div>
  );
};

export default ToggleWithHelper;
