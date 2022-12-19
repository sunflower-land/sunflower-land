import React from "react";

import suspiciousGoblin from "assets/npcs/suspicious_goblin.gif";

export const PhantomWalletNotSupported: React.FC = () => {
  return (
    <div className="flex flex-col text-center items-center p-1">
      <p>Phantom Wallet not supported</p>

      <img src={suspiciousGoblin} alt="Warning" className="w-16 m-2" />

      <p className="mt-2 mb-2 text-sm">
        Please disable phantom wallet to play Sunflower Land
      </p>
    </div>
  );
};
