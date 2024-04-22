import type { SVGProps } from 'react';
import React from 'react';

const CogOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 7.25C8.92894 7.25 7.25 8.92893 7.25 11C7.25 13.0711 8.92894 14.75 11 14.75C13.0711 14.75 14.75 13.0711 14.75 11C14.75 8.92893 13.0711 7.25 11 7.25ZM8.75 11C8.75 9.75736 9.75736 8.75 11 8.75C12.2426 8.75 13.25 9.75736 13.25 11C13.25 12.2426 12.2426 13.25 11 13.25C9.75736 13.25 8.75 12.2426 8.75 11Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.9747 0.25C10.5303 0.249993 10.1592 0.249987 9.85463 0.27077C9.53753 0.292406 9.238 0.339049 8.94761 0.459332C8.27379 0.73844 7.73843 1.27379 7.45932 1.94762C7.31402 2.29842 7.27467 2.66812 7.25964 3.06996C7.24756 3.39299 7.08454 3.66251 6.84395 3.80141C6.60337 3.94031 6.28845 3.94673 6.00266 3.79568C5.64714 3.60777 5.30729 3.45699 4.93083 3.40743C4.20773 3.31223 3.47642 3.50819 2.89779 3.95219C2.64843 4.14353 2.45827 4.3796 2.28099 4.6434C2.11068 4.89681 1.92517 5.21815 1.70294 5.60307L1.67769 5.64681C1.45545 6.03172 1.26993 6.35304 1.13562 6.62723C0.995808 6.91267 0.886439 7.19539 0.845413 7.50701C0.750214 8.23012 0.946167 8.96142 1.39016 9.54005C1.62128 9.84125 1.92173 10.0602 2.26217 10.2741C2.53595 10.4461 2.68788 10.7221 2.68786 11C2.68785 11.2778 2.53592 11.5538 2.26217 11.7258C1.92169 11.9397 1.62121 12.1587 1.39007 12.4599C0.946069 13.0385 0.750116 13.7698 0.845315 14.4929C0.886341 14.8045 0.99571 15.0873 1.13552 15.3727C1.26983 15.6469 1.45535 15.9682 1.67758 16.3531L1.70284 16.3969C1.92507 16.7818 2.11058 17.1031 2.28089 17.3565C2.45817 17.6203 2.64833 17.8564 2.89769 18.0477C3.47632 18.4917 4.20763 18.6877 4.93073 18.5925C5.30717 18.5429 5.647 18.3922 6.0025 18.2043C6.28833 18.0532 6.60329 18.0596 6.8439 18.1986C7.08452 18.3375 7.24756 18.607 7.25964 18.9301C7.27467 19.3319 7.31403 19.7016 7.45932 20.0524C7.73843 20.7262 8.27379 21.2616 8.94761 21.5407C9.238 21.661 9.53753 21.7076 9.85463 21.7292C10.1592 21.75 10.5303 21.75 10.9747 21.75H11.0252C11.4697 21.75 11.8407 21.75 12.1454 21.7292C12.4625 21.7076 12.762 21.661 13.0524 21.5407C13.7262 21.2616 14.2616 20.7262 14.5407 20.0524C14.686 19.7016 14.7253 19.3319 14.7403 18.93C14.7524 18.607 14.9154 18.3375 15.156 18.1985C15.3966 18.0596 15.7116 18.0532 15.9974 18.2042C16.3529 18.3921 16.6927 18.5429 17.0692 18.5924C17.7923 18.6876 18.5236 18.4917 19.1022 18.0477C19.3516 17.8563 19.5417 17.6203 19.719 17.3565C19.8893 17.1031 20.0748 16.7818 20.297 16.3969L20.3223 16.3531C20.5445 15.9682 20.7301 15.6468 20.8644 15.3726C21.0042 15.0872 21.1135 14.8045 21.1546 14.4929C21.2498 13.7697 21.0538 13.0384 20.6098 12.4598C20.3787 12.1586 20.0782 11.9397 19.7378 11.7258C19.464 11.5538 19.3121 11.2778 19.3121 10.9999C19.3121 10.7221 19.464 10.4462 19.7377 10.2742C20.0783 10.0603 20.3788 9.84136 20.6099 9.54012C21.0539 8.96149 21.2499 8.23019 21.1547 7.50708C21.1136 7.19546 21.0043 6.91274 20.8645 6.6273C20.7302 6.35313 20.5447 6.03183 20.3224 5.64695L20.2972 5.60318C20.0749 5.21825 19.8894 4.89688 19.7191 4.64347C19.5418 4.37967 19.3517 4.1436 19.1023 3.95225C18.5237 3.50826 17.7924 3.3123 17.0692 3.4075C16.6928 3.45706 16.353 3.60782 15.9975 3.79572C15.7117 3.94679 15.3967 3.94036 15.1561 3.80144C14.9155 3.66253 14.7524 3.39297 14.7403 3.06991C14.7253 2.66808 14.686 2.2984 14.5407 1.94762C14.2616 1.27379 13.7262 0.73844 13.0524 0.459332C12.762 0.339049 12.4625 0.292406 12.1454 0.27077C11.8407 0.249987 11.4697 0.249993 11.0252 0.25H10.9747ZM9.52164 1.84515C9.59879 1.81319 9.71601 1.78372 9.95673 1.76729C10.2042 1.75041 10.5238 1.75 11 1.75C11.4762 1.75 11.7958 1.75041 12.0432 1.76729C12.284 1.78372 12.4012 1.81319 12.4783 1.84515C12.7846 1.97202 13.028 2.21536 13.1548 2.52165C13.1949 2.61826 13.228 2.76887 13.2414 3.12597C13.271 3.91835 13.68 4.68129 14.4061 5.10048C15.1321 5.51968 15.9974 5.4924 16.6984 5.12188C17.0143 4.9549 17.1614 4.90832 17.265 4.89467C17.5937 4.8514 17.9261 4.94047 18.1891 5.14228C18.2554 5.19312 18.3395 5.27989 18.4741 5.48016C18.6125 5.68603 18.7726 5.9626 19.0107 6.375C19.2488 6.78741 19.4083 7.06438 19.5174 7.28713C19.6235 7.50382 19.6566 7.62007 19.6675 7.70287C19.7108 8.03155 19.6217 8.36397 19.4199 8.62698C19.3562 8.70995 19.2424 8.81399 18.9397 9.00414C18.2684 9.42595 17.8122 10.1616 17.8121 10.9999C17.8121 11.8383 18.2683 12.574 18.9397 12.9959C19.2423 13.186 19.3561 13.29 19.4198 13.373C19.6216 13.636 19.7107 13.9684 19.6674 14.2971C19.6565 14.3799 19.6234 14.4961 19.5173 14.7128C19.4082 14.9355 19.2487 15.2125 19.0106 15.6249C18.7725 16.0373 18.6124 16.3139 18.474 16.5198C18.3394 16.72 18.2553 16.8068 18.189 16.8576C17.926 17.0595 17.5936 17.1485 17.2649 17.1053C17.1613 17.0916 17.0142 17.045 16.6983 16.8781C15.9973 16.5075 15.132 16.4803 14.4059 16.8995C13.68 17.3187 13.271 18.0816 13.2414 18.874C13.228 19.2311 13.1949 19.3817 13.1548 19.4784C13.028 19.7846 12.7846 20.028 12.4783 20.1549C12.4012 20.1868 12.284 20.2163 12.0432 20.2327C11.7958 20.2496 11.4762 20.25 11 20.25C10.5238 20.25 10.2042 20.2496 9.95673 20.2327C9.71601 20.2163 9.59879 20.1868 9.52164 20.1549C9.21535 20.028 8.97201 19.7846 8.84514 19.4784C8.80512 19.3817 8.77195 19.2311 8.75859 18.874C8.72896 18.0817 8.31997 17.3187 7.5939 16.8995C6.86784 16.4803 6.00262 16.5076 5.30158 16.8781C4.98565 17.0451 4.83863 17.0917 4.73495 17.1053C4.40626 17.1486 4.07385 17.0595 3.81084 16.8577C3.74458 16.8069 3.66045 16.7201 3.52586 16.5198C3.38751 16.314 3.22736 16.0374 2.98926 15.625C2.75115 15.2126 2.59171 14.9356 2.4826 14.7129C2.37646 14.4962 2.34338 14.3799 2.33248 14.2971C2.28921 13.9684 2.37828 13.636 2.5801 13.373C2.64376 13.2901 2.75761 13.186 3.0602 12.9959C3.73158 12.5741 4.18782 11.8384 4.18786 11.0001C4.18791 10.1616 3.73165 9.42587 3.06021 9.00398C2.75769 8.81389 2.64385 8.70987 2.58019 8.62691C2.37838 8.3639 2.28931 8.03149 2.33258 7.7028C2.34348 7.62001 2.37656 7.50375 2.4827 7.28707C2.59181 7.06431 2.75125 6.78734 2.98935 6.37493C3.22746 5.96253 3.3876 5.68596 3.52596 5.48009C3.66055 5.27983 3.74468 5.19305 3.81093 5.14222C4.07395 4.9404 4.40636 4.85133 4.73504 4.8946C4.83873 4.90825 4.98576 4.95483 5.30173 5.12184C6.00273 5.49235 6.86791 5.51962 7.59394 5.10045C8.31998 4.68128 8.72896 3.91837 8.75859 3.12602C8.77195 2.76889 8.80512 2.61827 8.84514 2.52165C8.97201 2.21536 9.21535 1.97202 9.52164 1.84515Z"
      fill="currentColor"
    />
  </svg>
);

export default CogOutline;
