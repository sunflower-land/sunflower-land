import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";
import { Button } from "components/ui/Button";
import { Context as GameContext } from "features/game/GameProvider";
import * as Auth from "features/auth/lib/Provider";
import { ContentComponentProps } from "../GameOptions";
import { SUNNYSIDE } from "assets/sunnyside";
import { connectToFSL } from "features/auth/actions/oauth";
import { hasFeatureAccess } from "lib/flags";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { removeJWT } from "features/auth/actions/social";
import { useSelector } from "@xstate/react";
import { CONFIG } from "lib/config";

export const Account: React.FC<ContentComponentProps> = ({
  onSubMenuClick,
}) => {
  const { gameService } = useContext(GameContext);
  const { authService } = useContext(Auth.Context);
  const { t } = useAppTranslation();

  const [isConfirmLogoutModalOpen, showConfirmLogoutModal] = useState(false);

  const onLogout = () => {
    removeJWT();
    authService.send("LOGOUT");
  };

  const fslId = useSelector(gameService, (state) => state.context.fslId);
  const oauthNonce = useSelector(
    gameService,
    (state) => state.context.oauthNonce,
  );
  const state = useSelector(gameService, (state) => state.context.state);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        <Button
          disabled={!!fslId}
          onClick={() => connectToFSL({ nonce: oauthNonce })}
          className="relative"
        >
          {`Connect FSL ID`}
          {!!fslId && (
            <img
              src={SUNNYSIDE.icons.confirm}
              className="absolute right-1 top-1 h-5"
            />
          )}
        </Button>
        <Button onClick={() => onSubMenuClick("discord")}>
          <span>{`Discord`}</span>
        </Button>
        {CONFIG.NETWORK === "amoy" && (
          <Button onClick={() => onSubMenuClick("linkedAccounts")}>
            <span>{`Linked Accounts`}</span>
          </Button>
        )}
        {hasFeatureAccess(state, "FACE_RECOGNITION_TEST") && (
          <Button onClick={() => onSubMenuClick("faceRecognition")}>
            <span>{t("gameOptions.faceRecognition")}</span>
          </Button>
        )}
        <Button onClick={() => showConfirmLogoutModal(true)}>
          {t("gameOptions.logout")}
        </Button>
      </div>
      <ConfirmationModal
        show={isConfirmLogoutModalOpen}
        onHide={() => showConfirmLogoutModal(false)}
        messages={[t("gameOptions.confirmLogout")]}
        onCancel={() => showConfirmLogoutModal(false)}
        onConfirm={onLogout}
        confirmButtonLabel={t("gameOptions.logout")}
      />
    </>
  );
};
