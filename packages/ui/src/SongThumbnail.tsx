/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";

interface Props {
  className: any;
}

export const SongThumbnail = ({ className }: Props): JSX.Element => {
  return (
    <div
      className={`w-[65px] h-[65px] rounded-[16px] bg-cover bg-[50%_50%] ${className}`}
    />
  );
};
