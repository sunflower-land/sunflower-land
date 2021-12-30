import React from "react";

import alert from "../../images/ui/expression_alerted.png";

import "./Banner.css";

export const Banner: React.FC = () => {
  return (
    <div id="halvening-banner">
      <img src={alert} />
      <div>
        <span>
          When total supply reaches 500K, crop and upgrade prices will be
          halved. Be prepared!
        </span>
        <a
          href="https://docs.sunflower-farmers.com/tokenomics#the-halvening"
          target="_blank"
        >
          Read more
        </a>
      </div>
    </div>
  );
};
