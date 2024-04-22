/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";

interface Props {
  color: string;
  className: any;
}

export const Icons1 = ({ color = "white", className }: Props): JSX.Element => {
  return (
    <svg
      className={`${className}`}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_2547_734)">
        <path
          d="M2.68376 3.95005L21.5703 3.95005L12.1272 20.306L9.36084 11.2374C9.32085 11.1063 9.25144 10.9861 9.15792 10.8859L2.68376 3.95005Z"
          stroke={color}
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </g>
      <defs>
        <clipPath id="clip0_2547_734">
          <rect fill="white" height="24" width="24" />
        </clipPath>
      </defs>
    </svg>
  );
};

Icons1.propTypes = {
  color: PropTypes.string,
};
