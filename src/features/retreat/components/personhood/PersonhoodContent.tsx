import React, { useCallback, useContext, useEffect, useState } from "react";

import personhoodStyle from "@anima-protocol/personhood-sdk-react/style.css?inline";

import { Personhood } from "@anima-protocol/personhood-sdk-react";
import { wallet } from "lib/blockchain/wallet";
import {
  PersonhoodDetails,
  loadPersonhoodDetails,
} from "features/game/actions/personhood";
import * as AuthProvider from "features/auth/lib/Provider";
import { useActor } from "@xstate/react";
import { Loading } from "features/auth/components";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";

export const PersonhoodContent: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);
  const { gameService } = useContext(Context);

  const { t } = useAppTranslation();

  const [loading, setLoading] = useState(true);
  const [personHoodDetails, setPersonhoodDetails] = useState<
    PersonhoodDetails | undefined
  >();

  const loadPersonhood = async () => {
    return await loadPersonhoodDetails(
      Number(gameService.state.context.farmId),
      authState.context.user.rawToken as string,
      authState.context.transactionId as string,
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
    (payload: string | object) =>
      wallet.web3Provider.eth.personal.sign(
        String(payload),
        wallet.myAccount as string,
        "",
      ),
    [wallet.myAccount],
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
        walletAddress={wallet.myAccount as string}
      />
    </>
  );
};
