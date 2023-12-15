import type { SVGProps } from 'react';
import React from 'react';

const GraphOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 20 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.9553 0.250003C16.5224 0.249952 16.1256 0.249906 15.8028 0.293307C15.4473 0.3411 15.0716 0.453547 14.7626 0.76257C14.4535 1.07159 14.3411 1.44732 14.2933 1.8028C14.2499 2.12561 14.25 2.52244 14.25 2.95525V16.0448C14.25 16.4776 14.2499 16.8744 14.2933 17.1972C14.3411 17.5527 14.4535 17.9284 14.7626 18.2374C15.0716 18.5465 15.4473 18.6589 15.8028 18.7067C16.1256 18.7501 16.5224 18.7501 16.9553 18.75H17.0448C17.4776 18.7501 17.8744 18.7501 18.1972 18.7067C18.5527 18.6589 18.9284 18.5465 19.2374 18.2374C19.5465 17.9284 19.6589 17.5527 19.7067 17.1972C19.7501 16.8744 19.7501 16.4776 19.75 16.0448V2.95526C19.7501 2.52245 19.7501 2.12561 19.7067 1.8028C19.6589 1.44732 19.5465 1.07159 19.2374 0.76257C18.9284 0.453547 18.5527 0.3411 18.1972 0.293307C17.8744 0.249906 17.4776 0.249952 17.0448 0.250003H16.9553ZM15.8257 1.82187L15.8232 1.82324L15.8219 1.82568C15.8209 1.82761 15.8192 1.83093 15.8172 1.83597C15.8082 1.85775 15.7929 1.90611 15.7799 2.00267C15.7516 2.21339 15.75 2.5074 15.75 3.00001V16C15.75 16.4926 15.7516 16.7866 15.7799 16.9973C15.7929 17.0939 15.8082 17.1423 15.8172 17.164C15.8192 17.1691 15.8209 17.1724 15.8219 17.1743L15.8232 17.1768L15.8257 17.1781C15.8265 17.1786 15.8276 17.1791 15.8289 17.1797C15.8307 17.1806 15.8331 17.1817 15.836 17.1828C15.8578 17.1918 15.9061 17.2071 16.0027 17.2201C16.2134 17.2484 16.5074 17.25 17 17.25C17.4926 17.25 17.7866 17.2484 17.9973 17.2201C18.0939 17.2071 18.1423 17.1918 18.164 17.1828C18.1691 17.1808 18.1724 17.1792 18.1743 17.1781L18.1768 17.1768L18.1781 17.1743C18.1792 17.1724 18.1808 17.1691 18.1828 17.164C18.1918 17.1423 18.2071 17.0939 18.2201 16.9973C18.2484 16.7866 18.25 16.4926 18.25 16V3.00001C18.25 2.5074 18.2484 2.21339 18.2201 2.00267C18.2071 1.90611 18.1918 1.85775 18.1828 1.83597C18.1808 1.83093 18.1792 1.82761 18.1781 1.82568L18.1768 1.82324L18.1743 1.82187C18.1724 1.82086 18.1691 1.81924 18.164 1.81717C18.1423 1.80821 18.0939 1.79291 17.9973 1.77993C17.7866 1.7516 17.4926 1.75001 17 1.75001C16.5074 1.75001 16.2134 1.7516 16.0027 1.77993C15.9061 1.79291 15.8578 1.80821 15.836 1.81717C15.8309 1.81924 15.8276 1.82086 15.8257 1.82187Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.95526 3.25H10.0448C10.4776 3.24995 10.8744 3.24991 11.1972 3.29331C11.5527 3.3411 11.9284 3.45355 12.2374 3.76257C12.5465 4.07159 12.6589 4.44732 12.7067 4.8028C12.7501 5.12561 12.7501 5.52243 12.75 5.95524V16.0448C12.7501 16.4776 12.7501 16.8744 12.7067 17.1972C12.6589 17.5527 12.5465 17.9284 12.2374 18.2374C11.9284 18.5465 11.5527 18.6589 11.1972 18.7067C10.8744 18.7501 10.4776 18.7501 10.0448 18.75H9.95526C9.52247 18.7501 9.1256 18.7501 8.8028 18.7067C8.44732 18.6589 8.07159 18.5465 7.76257 18.2374C7.45355 17.9284 7.3411 17.5527 7.29331 17.1972C7.24991 16.8744 7.24995 16.4776 7.25 16.0448V5.95526C7.24995 5.52244 7.24991 5.12561 7.29331 4.8028C7.3411 4.44732 7.45355 4.07159 7.76257 3.76257C8.07159 3.45355 8.44732 3.3411 8.8028 3.29331C9.12561 3.24991 9.52244 3.24995 9.95526 3.25ZM8.82324 4.82324L8.82568 4.82187L8.82336 17.1768L8.82187 17.1743C8.82086 17.1724 8.81924 17.1691 8.81717 17.164C8.8082 17.1423 8.79291 17.0939 8.77993 16.9973C8.7516 16.7866 8.75001 16.4926 8.75001 16V6.00001C8.75001 5.5074 8.7516 5.21339 8.77993 5.00267C8.79291 4.90611 8.8082 4.85775 8.81717 4.83597C8.81924 4.83093 8.82086 4.82761 8.82187 4.82568L8.82324 4.82324ZM8.82336 17.1768L8.82568 4.82187L8.82949 4.81999L8.83597 4.81717C8.85775 4.80821 8.90611 4.79291 9.00267 4.77993C9.21339 4.7516 9.5074 4.75001 10 4.75001C10.4926 4.75001 10.7866 4.7516 10.9973 4.77993C11.0939 4.79291 11.1423 4.80821 11.164 4.81717C11.1691 4.81924 11.1724 4.82086 11.1743 4.82187L11.1768 4.82324L11.1781 4.82568C11.1792 4.82761 11.1808 4.83093 11.1828 4.83597C11.1918 4.85775 11.2071 4.90611 11.2201 5.00267C11.2484 5.21339 11.25 5.5074 11.25 6.00001V16C11.25 16.4926 11.2484 16.7866 11.2201 16.9973C11.2071 17.0939 11.1918 17.1423 11.1828 17.164C11.1808 17.1691 11.1792 17.1724 11.1781 17.1743L11.1768 17.1768L11.1743 17.1781C11.1731 17.1788 11.1712 17.1797 11.1686 17.1809C11.1673 17.1815 11.1658 17.1821 11.164 17.1828C11.1423 17.1918 11.0939 17.2071 10.9973 17.2201C10.7866 17.2484 10.4926 17.25 10 17.25C9.5074 17.25 9.21339 17.2484 9.00267 17.2201C8.90611 17.2071 8.85775 17.1918 8.83597 17.1828C8.83093 17.1808 8.82761 17.1792 8.82568 17.1781L8.82336 17.1768Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.95526 7.25C2.52244 7.24995 2.12561 7.24991 1.8028 7.29331C1.44732 7.3411 1.07159 7.45355 0.76257 7.76257C0.453547 8.07159 0.3411 8.44732 0.293307 8.8028C0.249906 9.12561 0.249952 9.52244 0.250003 9.95526V16.0448C0.249952 16.4776 0.249906 16.8744 0.293307 17.1972C0.3411 17.5527 0.453547 17.9284 0.76257 18.2374C1.07159 18.5465 1.44732 18.6589 1.8028 18.7067C2.12561 18.7501 2.52245 18.7501 2.95526 18.75H3.04475C3.47757 18.7501 3.8744 18.7501 4.19721 18.7067C4.5527 18.6589 4.92842 18.5465 5.23744 18.2374C5.54647 17.9284 5.65891 17.5527 5.70671 17.1972C5.75011 16.8744 5.75006 16.4776 5.75001 16.0448V9.95526C5.75006 9.52245 5.75011 9.12561 5.70671 8.8028C5.65891 8.44732 5.54647 8.07159 5.23744 7.76257C4.92842 7.45355 4.5527 7.3411 4.19721 7.29331C3.8744 7.24991 3.47757 7.24995 3.04476 7.25H2.95526ZM1.82568 8.82187L1.82324 8.82324L1.82187 8.82568C1.82086 8.82761 1.81924 8.83093 1.81717 8.83597C1.80821 8.85775 1.79291 8.90611 1.77993 9.00267C1.7516 9.21339 1.75001 9.5074 1.75001 10V16C1.75001 16.4926 1.7516 16.7866 1.77993 16.9973C1.79291 17.0939 1.80821 17.1423 1.81717 17.164C1.81924 17.1691 1.82086 17.1724 1.82187 17.1743L1.82284 17.1761L1.82568 17.1781C1.82761 17.1792 1.83093 17.1808 1.83597 17.1828C1.85775 17.1918 1.90611 17.2071 2.00267 17.2201C2.21339 17.2484 2.5074 17.25 3.00001 17.25C3.49261 17.25 3.78662 17.2484 3.99734 17.2201C4.0939 17.2071 4.14226 17.1918 4.16404 17.1828C4.16909 17.1808 4.1724 17.1792 4.17434 17.1781L4.17677 17.1768L4.17815 17.1743L4.18036 17.1698L4.18285 17.164C4.19181 17.1423 4.2071 17.0939 4.22008 16.9973C4.24841 16.7866 4.25001 16.4926 4.25001 16V10C4.25001 9.5074 4.24841 9.21339 4.22008 9.00267C4.2071 8.90611 4.19181 8.85775 4.18285 8.83597C4.18077 8.83093 4.17916 8.82761 4.17815 8.82568L4.17677 8.82324L4.17434 8.82187C4.1724 8.82086 4.16909 8.81924 4.16404 8.81717C4.14226 8.8082 4.0939 8.79291 3.99734 8.77993C3.78662 8.7516 3.49261 8.75001 3.00001 8.75001C2.5074 8.75001 2.21339 8.7516 2.00267 8.77993C1.90611 8.79291 1.85775 8.8082 1.83597 8.81717C1.83093 8.81924 1.82761 8.82086 1.82568 8.82187Z"
      fill="currentColor"
    />
    <path
      d="M1.00001 20.25C0.585793 20.25 0.250007 20.5858 0.250007 21C0.250007 21.4142 0.585793 21.75 1.00001 21.75H19C19.4142 21.75 19.75 21.4142 19.75 21C19.75 20.5858 19.4142 20.25 19 20.25H1.00001Z"
      fill="currentColor"
    />
  </svg>
);

export default GraphOutline;
