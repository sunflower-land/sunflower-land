import React, { useContext } from "react";

import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { Label } from "components/ui/Label";
import walletIcon from "assets/icons/wallet.png";
import { WalletWall } from "./WalletWall";
import { Context } from "features/game/GameProvider";
import { Context as AuthContext } from "features/auth/lib/Provider";

const LinkHeader: React.FC = () => {
  const { t } = useAppTranslation();

  return (
    <>
      <div className="flex justify-between">
        <Label className="ml-2 mt-1 mb-2" icon={walletIcon} type="default">
          {t("wallet.linkWeb3")}
        </Label>
      </div>
      <p className="text-xs mx-1 mb-2">
        {t("wallet.setupWeb3")}
        {"."}
      </p>
    </>
  );
};

export const LinkWallet: React.FC = () => {
  const { gameService } = useContext(Context);
  const { authService } = useContext(AuthContext);

  return (
    <WalletWall
      header={<LinkHeader />}
      onSignMessage={({ address, signature }) => {
        gameService.send("wallet.linked", {
          effect: {
            type: "wallet.linked",
            linkedWallet: address,
            signature,
          },
          authToken: authService.state.context.user.rawToken as string,
        });
      }}
    />
  );
};
