import React from "react";

import timer from "src/assets/icons/timer.png";

export const Expanding: React.FC = () => (
  <div className="flex flex-col items-center p-2">
    <span className="text-shadow text-center loading">Expansion incoming</span>
    <img src={timer} className="flip w-1/12 mt-4 mb-6" />
    <span className="text-sm">The expansion will be ready shortly!</span>
  </div>
);
