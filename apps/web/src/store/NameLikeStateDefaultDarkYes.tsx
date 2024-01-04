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

export const NameLikeStateDefaultDarkYes = ({ color = "white", className }: Props): JSX.Element => {
  return (
    <svg
      className={`${className}`}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.3139 6.18327L11.6641 5.55282C11.5296 5.42232 11.4001 5.29727 11.2744 5.17579C11.0546 4.96344 10.8461 4.76199 10.6414 4.56135C9.00067 2.95357 6.7423 2.49837 4.93294 3.2796L4.93277 3.27967C3.11902 4.06238 1.85697 6.05585 1.90106 8.28768L1.90106 8.28774C1.93437 9.97959 2.64322 11.4797 3.67629 12.964L3.67657 12.9644C5.93141 16.2077 8.99031 18.6438 12.2533 21.0297C14.6307 19.2988 16.895 17.5125 18.8502 15.3973L19.5111 16.0082L18.8502 15.3973C20.5093 13.6025 21.8746 11.787 22.4325 9.53903L22.4326 9.53879C23.0206 7.17217 22.0148 4.70661 20.1001 3.55445L12.3139 6.18327ZM12.3139 6.18327L12.9405 5.52965M12.3139 6.18327L12.9405 5.52965M12.9405 5.52965C13.0846 5.37928 13.212 5.24119 13.3317 5.11135C13.5615 4.86215 13.7632 4.64336 14.0019 4.42661L14.0022 4.42629M12.9405 5.52965L14.0022 4.42629M14.0022 4.42629C15.8653 2.73235 18.2782 2.45884 20.0999 3.55435L14.0022 4.42629ZM12.0872 21.1504C12.0874 21.1503 12.0877 21.1501 12.0879 21.1499C12.0877 21.1501 12.0875 21.1502 12.0873 21.1504L12.0872 21.1504ZM12.1764 21.1002L12.1834 21.0998C12.1896 21.0997 12.2038 21.0997 12.2249 21.1021C12.2452 21.1045 12.2813 21.1101 12.3277 21.1253C12.3732 21.1401 12.444 21.169 12.5214 21.2254L12.1764 21.1002Z"
        stroke={color}
        strokeWidth="1.8"
      />
    </svg>
  );
};

NameLikeStateDefaultDarkYes.propTypes = {
  color: PropTypes.string,
};