/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";

interface Props {
  className: any;
}

export const PropertyDefault = ({ className }: Props): JSX.Element => {
  return (
    <div className={`relative w-[24px] h-[24px] ${className}`}>
      <div className="absolute w-[2px] h-[6px] top-[9px] left-px bg-[#fee801] rounded-[50px]" />
      <div className="absolute w-[2px] h-[16px] top-[4px] left-[5px] bg-[#fee801] rounded-[50px]" />
      <div className="absolute w-[2px] h-[12px] top-[6px] left-[13px] bg-[#fee801] rounded-[50px]" />
      <div className="absolute w-[2px] h-[20px] top-[2px] left-[17px] bg-[#fee801] rounded-[50px]" />
      <div className="absolute w-[2px] h-[8px] top-[8px] left-[21px] bg-[#fee801] rounded-[50px]" />
      <div className="absolute w-[2px] h-[24px] top-0 left-[9px] bg-[#fee801] rounded-[50px]" />
    </div>
  );
};
