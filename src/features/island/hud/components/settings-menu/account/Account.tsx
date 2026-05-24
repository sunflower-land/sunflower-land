import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";
import { Button } from "components/ui/Button";
import { Context as GameContext } from "features/game/GameProvider";
import * as Auth from "features/auth/lib/Provider";
import { ContentComponentProps } from "../types";
import { hasFeatureAccess } from "lib/flags";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { removeJWT } from "features/auth/actions/social";
import { useSelector } from "@xstate/react";

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

  const state = useSelector(gameService, (state) => state.context.state);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        <Button onClick={() => onSubMenuClick("linkedAccounts")}>
          <span>{t("gameOptions.linkedAccounts")}</span>
        </Button>
        <Button onClick={() => onSubMenuClick("referAFriend")}>
          <span>{t("gameOptions.account.referFriend")}</span>
        </Button>
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
