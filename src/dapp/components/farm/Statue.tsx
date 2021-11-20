import React from "react";

import statue from "../../images/ui/sunflower_statue.png";

import "./Statue.css";

export const Statue: React.FC = () => {
  return (
    <>
      <div id="statue">{/* //<img src={statue} alt="statue" /> */}</div>
      <div className="dirt" style={{ gridColumn: 6, gridRow: 7 }} />
      <div className="dirt" style={{ gridColumn: 6, gridRow: 6 }} />
    </>
  );
};
