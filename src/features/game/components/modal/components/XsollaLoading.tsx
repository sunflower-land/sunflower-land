import React, { useEffect, useState } from "react";

export const XsollaLoading: React.FC<{ autoClose: boolean }> = ({
  autoClose,
}) => {
  const [closed, setClosed] = useState<boolean>(false);

  useEffect(() => {
    if (autoClose) {
      setTimeout(() => {
        setClosed(true);
      }, 10000);
    }
  }, [autoClose]);

  if (closed) return null;

  return (
    <div className="flex items-center justify-center w-full h-full absolute">
      <svg
        width="24"
        height="24"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-[spin_2s_linear_infinite]"
      >
        <path
          d="M45.5 24C45.5 28.2523 44.239 32.4091 41.8766 35.9448C39.5141 39.4804 36.1563 42.2361 32.2277 43.8634C28.2991 45.4907 23.9762 45.9165 19.8056 45.0869C15.635 44.2573 11.804 42.2096 8.7972 39.2028C5.79038 36.196 3.7427 32.365 2.91312 28.1944C2.08353 24.0239 2.50931 19.7009 4.13659 15.7723C5.76387 11.8437 8.51958 8.48585 12.0552 6.1234C15.5909 3.76095 19.7477 2.5 24 2.5"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
