import React, { useContext } from "react";

import * as Auth from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { translate } from "lib/i18n/translate";

export const ConnectedToWallet: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const signIn = () => {
    authService.send("SIGN");
  };

  return (
    <>
      <div className="flex flex-col items-center p-2">
        <span>{translate("connected")}!</span>
        <img src={SUNNYSIDE.npcs.idle} alt="Warning" className="w-8 m-2" />
        <span className="text-sm mb-2 w-full">
          {translate("transaction.t&c.one")}
        </span>
      </div>
      <Button onClick={signIn}>{translate("transaction.t&c.two")}</Button>
    </>
  );
};
