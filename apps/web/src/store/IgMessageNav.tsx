/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from 'react';
import { NameLikeStateDefaultDarkYes } from './NameLikeStateDefaultDarkYes';
import { Icons1 } from './Icons1';

export const IgMessageNav = (): JSX.Element => {
  return (
    <div className="relative flex h-[40px] w-[390px] items-center justify-center gap-[16px] px-[12px] py-0">
      <div className="relative flex flex-1 grow items-start gap-[10px] rounded-[100px] border border-solid border-[#ffffff80] px-[17px] py-[9px]">
        <div className="relative mt-[-1.00px] w-fit whitespace-nowrap text-center text-[16px] font-normal leading-[22px] tracking-[0] text-white [font-family:'SF_Pro_Text-Regular',Helvetica]">
          Send message
        </div>
      </div>
      <NameLikeStateDefaultDarkYes
        className="!relative !h-[24px] !w-[24px]"
        color="white"
      />
      <Icons1 className="!relative !h-[24px] !w-[24px]" color="white" />
    </div>
  );
};
