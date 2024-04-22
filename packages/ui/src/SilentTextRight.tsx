/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";

interface Props {
  className: any;
}

export const SilentTextRight = ({ className }: Props): JSX.Element => {
  return (
    <div className={`relative w-[38px] h-[22px] ${className}`}>
      <div className="absolute -top-px -left-px [font-family:'SF_Pro_Text-Regular',Helvetica] font-normal text-[#ff3b30] text-[15px] text-center tracking-[0] leading-[22px] whitespace-nowrap">
        Silent
      </div>
    </div>
  );
};
