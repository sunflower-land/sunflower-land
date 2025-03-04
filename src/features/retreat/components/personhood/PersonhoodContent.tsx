import React, { useCallback, useContext, useEffect, useState } from "react";

import personhoodStyle from "@anima-protocol/personhood-sdk-react/style.css?inline";

import { Personhood } from "@anima-protocol/personhood-sdk-react";
import { wallet } from "lib/blockchain/wallet";
import {
  PersonhoodDetails,
  loadPersonhoodDetails,
} from "features/game/actions/personhood";
import * as AuthProvider from "features/auth/lib/Provider";
import { useSelector } from "@xstate/react";
import { Loading } from "features/auth/components";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";
import { signMessage } from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";
import { AuthMachineState } from "features/auth/lib/authMachine";

const _rawToken = (state: AuthMachineState) =>
  state.context.user.rawToken as string;
const _transactionId = (state: AuthMachineState) =>
  state.context.transactionId as string;

export const PersonhoodContent: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(Context);
  const rawToken = useSelector(authService, _rawToken);
  const transactionId = useSelector(authService, _transactionId);

  const { t } = useAppTranslation();

  const [loading, setLoading] = useState(true);
  const [personHoodDetails, setPersonhoodDetails] = useState<
    PersonhoodDetails | undefined
  >();

  const loadPersonhood = async () => {
    return await loadPersonhoodDetails(
      Number(gameService.state.context.farmId),
      rawToken,
      transactionId,
    );
  };

  const onFinish = async () => {
    setLoading(true);
    const personhoodDetails = await loadPersonhood();
    gameService.send("PERSONHOOD_FINISHED", {
      verified: personhoodDetails.status === "APPROVED",
    });
  };

  const onBack = async () => {
    setLoading(true);
    gameService.send("PERSONHOOD_CANCELLED");
  };

  const load = async () => {
    setLoading(true);
    try {
      const personhoodDetails = await loadPersonhood();
      setLoading(false);
      setPersonhoodDetails(personhoodDetails);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const sign = useCallback(
    async (payload: string | object) => {
      const response = await signMessage(config, {
        message: String(payload),
        account: wallet.getAccount(),
      });

      return response;
    },
    [wallet.getAccount()],
  );

  if (loading) {
    return <Loading />;
  }

  if (personHoodDetails === undefined) {
    return (
      <>
        <p className="text-sm p-1 m-1">{t("personHood.Details")}</p>
        <Button className="mr-1" onClick={onBack}>
          {t("back")}
        </Button>
      </>
    );
  }

  if (personHoodDetails.status === "REJECTED") {
    return (
      <>
        <p className="text-sm p-1 m-1">{t("personHood.Identify")}</p>
        <Button className="mr-1" onClick={onBack}>
          {t("back")}
        </Button>
      </>
    );
  }

  if (personHoodDetails.status === "APPROVED") {
    return (
      <>
        <p className="text-sm p-1 m-1">{t("personHood.Congrat")}</p>
        <Button className="mr-1" onClick={onFinish}>
          {t("continue")}
        </Button>
      </>
    );
  }

  return (
    <>
      <style>{personhoodStyle}</style>
      <Personhood
        onFinish={() => onFinish()}
        sessionId={personHoodDetails.sessionId}
        signCallback={sign}
        walletAddress={wallet.getAccount()}
      />
    </>
  );
};
