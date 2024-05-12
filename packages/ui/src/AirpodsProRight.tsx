/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";

interface Props {
  className: any;
  overlapGroupClassName: any;
  ellipseClassName: any;
  ellipse: string;
}

export const AirpodsProRight = ({
  className,
  overlapGroupClassName,
  ellipseClassName,
  ellipse = "/img/ellipse-5-4.svg",
}: Props): JSX.Element => {
  return (
    <div className={`w-[22px] h-[22px] ${className}`}>
      <div className="relative w-[18px] h-[18px] top-[2px] left-[2px]">
        <div
          className={`relative w-[20px] h-[20px] -top-px -left-px  bg-[100%_100%] ${overlapGroupClassName}`}
        >
          <img className={`absolute w-[20px] h-[20px] top-0 left-0 ${ellipseClassName}`} alt="Ellipse" src={ellipse} />
        </div>
      </div>
    </div>
  );
};

AirpodsProRight.propTypes = {
  ellipse: PropTypes.string,
};
