import React from "react";
import alert from "assets/icons/expression_alerted.png";

export const GoblinTownModal: React.FC = () => {
  return (
    <div>
      <span>Do you want to visit Goblin Town?</span>

      <span>Goblin town offers rare NFTs and decentralized gameplay.</span>
      <span>All interactions happen directly with the Blockchain</span>
      <div className="flex items-center border-2 rounded-md border-black p-2 mt-2 mb-2 bg-[#e43b44]">
        <img src={alert} alt="alert" className="mr-2 w-5 h-5/6" />
        <span className="text-xs">NO SFF TOKENS OR FARM FOUND ON ACCOUNT</span>
      </div>
    </div>
  );
};
