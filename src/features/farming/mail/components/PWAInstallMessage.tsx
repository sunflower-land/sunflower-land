import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "@xstate/react";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { Message as IMessage } from "features/game/types/announcements";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import * as AuthProvider from "features/auth/lib/Provider";
import { getMagicLink } from "features/auth/actions/magicLink";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { usePWAInstall } from "features/pwa/PWAInstallProvider";
import {
  isMobile,
  isIOS,
  isAndroid,
  isChrome,
  isSafari,
} from "mobile-device-detect";
import { fixInstallPromptTextStyles } from "features/pwa/lib/fixInstallPromptStyles";
import {
  MagicLinkFlow,
  QRCodeFlow,
} from "features/island/hud/components/settings-menu/general-settings/InstallAppModal";

interface Props {
  conversationId: string;
  read?: boolean;
  message: IMessage;
  onAcknowledge: () => void;
}

const _farmId = (state: MachineState) => state.context.farmId;
const _token = (state: AuthMachineState) =>
  state.context.user.rawToken as string;

const CONTENT_HEIGHT = 300;

export const PWAInstallMessage: React.FC<Props> = ({
  conversationId,
  read,
  message,
  onAcknowledge,
}) => {
  const { t } = useAppTranslation();
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(Context);
  const [magicLink, setMagicLink] = useState<string | null>();

  const pwaInstall = usePWAInstall();

  const farmId = useSelector(gameService, _farmId);
  const token = useSelector(authService, _token);

  const isWeb3MobileBrowser = isMobile && !!window.ethereum;
  const showMagicLinkFlow =
    isWeb3MobileBrowser || (isAndroid && !isChrome) || (isIOS && !isSafari);
  const showInstallButtonFlow =
    (!isWeb3MobileBrowser && isAndroid && isChrome) || (isIOS && isSafari);
  const showQRCodeFlow = !isMobile;

  const fetchMagicLink = async () => {
    try {
      const { link } = await getMagicLink({
        token,
        farmId,
      });

      setMagicLink(link);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setMagicLink(null);
    }
  };

  useEffect(() => {
    if (magicLink) return;

    if (showMagicLinkFlow || showQRCodeFlow) {
      fetchMagicLink();
    }
  }, []);

  const handleAcknowledge = () => {
    if (!read) {
      gameService.send({ type: "message.read", id: conversationId });
    }
    onAcknowledge();
  };

  const handleInstall = () => {
    if (isIOS) {
      pwaInstall.current?.showDialog();
    } else {
      pwaInstall.current?.install();
    }

    fixInstallPromptTextStyles();

    handleAcknowledge();
  };

  const conversation = message;

  return (
    <div
      style={{ maxHeight: CONTENT_HEIGHT }}
      className="overflow-y-auto divide-brown-600 p-2 pb-0 scrollable"
    >
      <>
        {conversation.content.map((content, index) => (
          <div className="mb-2" key={index}>
            <p className="text-sm mb-2">{content.text}</p>
          </div>
        ))}

        {isMobile && showMagicLinkFlow && (
          <MagicLinkFlow magicLink={magicLink} />
        )}

        {isMobile && showInstallButtonFlow && (
          <div className="flex space-x-1">
            <Button onClick={handleAcknowledge}>{t("no.thanks")}</Button>
            <Button onClick={handleInstall}>{t("lets.go")}</Button>
          </div>
        )}

        {showQRCodeFlow && (
          <div className="space-y-2">
            <QRCodeFlow magicLink={magicLink} />
            {!read && <Button onClick={handleAcknowledge}>{t("gotIt")}</Button>}
          </div>
        )}
      </>
    </div>
  );
};
