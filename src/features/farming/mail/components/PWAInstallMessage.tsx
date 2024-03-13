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
import { translate } from "lib/i18n/translate";
import clipboard from "clipboard";
import { Label } from "components/ui/Label";
import { usePWAInstall } from "features/pwa/PWAInstallProvider";
import { isMobile, isIOS, getUA } from "mobile-device-detect";
import { fixInstallPromptTextStyles } from "features/pwa/lib/fixInstallPromptStyles";
import { QRCodeSVG } from "qrcode.react";
import logo from "assets/brand/icon.png";

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

const TOOL_TIP_MESSAGE = translate("copy.link");

export const PWAInstallMessage: React.FC<Props> = ({
  conversationId,
  read,
  message,
  onAcknowledge,
}) => {
  const { t } = useAppTranslation();
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(Context);
  const [showLabel, setShowLabel] = useState(true);
  const [tooltipMessage, setTooltipMessage] = useState(TOOL_TIP_MESSAGE);
  const [magicLink, setMagicLink] = useState<string>();

  const pwaInstall = usePWAInstall();

  const farmId = useSelector(gameService, _farmId);
  const token = useSelector(authService, _token);

  const isMetamaskMobile = /MetaMaskMobile/.test(getUA);
  const mobileBrowserToUser = isIOS ? "Safari" : "Chrome";

  const fetchMagicLink = async () => {
    const { link } = await getMagicLink({
      token,
      farmId,
    });

    setMagicLink(link);
  };

  useEffect(() => {
    if (magicLink) return;

    if (isMetamaskMobile || !isMobile) {
      fetchMagicLink();
    }
  }, []);

  const handleAcknowledge = () => {
    // gameService.send({ type: "message.read", id: conversationId });
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

  const copyToClipboard = () => {
    try {
      clipboard.copy(magicLink as string);

      setShowLabel(true);
      setTooltipMessage(translate("copied"));
    } catch (e: unknown) {
      setShowLabel(true);
      setTooltipMessage(typeof e === "string" ? e : "Copy Failed!");
    }

    // Close tooltip after two seconds
    setTimeout(() => {
      setShowLabel(false);
      setTooltipMessage(TOOL_TIP_MESSAGE);
    }, 2000);
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

        {isMobile && isMetamaskMobile && (
          <div className="relative w-full mb-2">
            <p className="text-sm mb-2">{`Copy the magic link below and open it in ${mobileBrowserToUser} on your device to install!`}</p>
            <p
              className="cursor-pointer text-xs underline"
              onMouseEnter={() => setShowLabel(true)}
              onMouseLeave={() => setShowLabel(false)}
              onClick={copyToClipboard}
            >
              {magicLink ? `Magic Link` : `Generating link...`}
            </p>
            <div
              className={`absolute top-11 left-9 mr-5 transition duration-400 pointer-events-none ${
                showLabel ? "opacity-100" : "opacity-0"
              }`}
            >
              <Label type="success">{tooltipMessage}</Label>
            </div>
          </div>
        )}

        {isMobile && !isMetamaskMobile && (
          <div className="flex space-x-1">
            <Button onClick={handleAcknowledge}>{`Not now`}</Button>
            <Button onClick={handleInstall}>{`Let's go!`}</Button>
          </div>
        )}

        {!isMobile && (
          <div>
            <p className="mb-2 text-sm">{`Scan the code to install on your device.`}</p>
            {!magicLink && (
              <p
                className="text-sm loading"
                style={{ marginLeft: 0 }}
              >{`Generating code`}</p>
            )}
            {magicLink && (
              <div className="flex justify-center mb-2">
                <QRCodeSVG
                  style={{ width: 150, height: 150 }}
                  level="M"
                  value={magicLink}
                  imageSettings={{
                    src: logo,
                    height: 20,
                    width: 20,
                    excavate: false,
                  }}
                />
              </div>
            )}
            {!read && <Button onClick={handleAcknowledge}>{t("gotIt")}</Button>}
          </div>
        )}
      </>
    </div>
  );
};
