/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";

interface Props {
  className: any;
}

export const ChargingIconRight = ({ className }: Props): JSX.Element => {
  return (
    <div className={`relative w-[73px] h-[22px] ${className}`}>
      <div className="absolute w-[32px] h-[17px] top-[3px] left-[38px] bg-[#3f6d34] rounded-[7px]">
        <div className="absolute w-[25px] h-[17px] top-0 left-0 rounded-[7px_0px_0px_7px] [background:linear-gradient(180deg,rgb(141,252,99)_0%,rgb(151,245,180)_100%)]" />
        <div className="absolute w-[2px] h-[6px] top-[5px] left-[33px] bg-[#4a6940] rounded-[2px]" />
      </div>
      <div className="absolute -top-px left-px [font-family:'SF_Pro_Text-Semibold',Helvetica] font-normal text-[#8deb92] text-[15px] text-right tracking-[0] leading-[22px] whitespace-nowrap">
        75%
      </div>
    </div>
  );
};
