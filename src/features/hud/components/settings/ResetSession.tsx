import React from "react";

import { removeSession } from "features/auth/actions/login";
import { metamask } from "lib/blockchain/metamask";

import { Button } from "components/ui/Button";
import alert from "assets/icons/expression_alerted.png";

export default function ResetSession() {
  const address = metamask.myAccount as string;
  console.log("Address:", address);

  const handleResetSessionClick = () => {
    removeSession(address);
    window.location.reload();
  };

  return (
    <>
      <div className="text-sm mb-4 text-center">Session Controls</div>
      <div className="text-xs my-4">
        Reset your current session only if you are having &quot;
        <span className="underline">Problems or Issues</span>&quot; with any of
        the following:
        <ul className="list-disc list-inside mt-2">
          <li>Onchain Sync</li>
          <li>Transactions</li>
          <li>Crafting</li>
          <li>Miniting SFL Items</li>
          <li>Persistent Errors</li>
        </ul>
      </div>
      <p className="text-xs">
        To reset your current session, click on the &quot;
        <span className="underline">Reset</span>&quot; button below.
      </p>
      <p className="text-xs mt-4 mb-3 underline">
        <strong>Note:</strong>
      </p>
      <div className="flex items-center border-2 rounded-md border-black p-2 bg-[#e43b44]">
        <img src={alert} alt="alert" className="mr-2 w-5 h-5/6" />
        <span className="text-xs">
          THIS WILL RESET YOUR CURRENT SESSION. PROCEED WITH CAUTION.
        </span>
      </div>
      <div className="flex justify-center mt-3">
        <Button
          className="text-sm w-1/3 px-1 mt-3"
          onClick={handleResetSessionClick}
        >
          Reset
        </Button>
      </div>
    </>
  );
}
