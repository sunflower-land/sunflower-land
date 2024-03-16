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
import { Label } from "components/ui/Label";
import { usePWAInstall } from "features/pwa/PWAInstallProvider";
import { isMobile, isIOS, getUA } from "mobile-device-detect";
import { fixInstallPromptTextStyles } from "features/pwa/lib/fixInstallPromptStyles";
import { QRCodeSVG } from "qrcode.react";
import logo from "assets/brand/icon.png";
import classNames from "classnames";
import { CopySvg } from "components/ui/CopyField";

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
  const [showLabel, setShowLabel] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState(TOOL_TIP_MESSAGE);
  const [magicLink, setMagicLink] = useState<string | null>();

  const pwaInstall = usePWAInstall();

  const farmId = useSelector(gameService, _farmId);
  const token = useSelector(authService, _token);

  const isMetamaskMobile = /MetaMaskMobile/.test(getUA);
  const mobileBrowserToUser = isIOS ? "Safari" : "Chrome";

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

    if (isMetamaskMobile || !isMobile) {
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(magicLink as string);

      setShowLabel(true);
      setTooltipMessage(translate("copied"));
    } catch (e: unknown) {
      setShowLabel(true);
      setTooltipMessage(typeof e === "string" ? e : translate("copy.failed"));
    }

    // Close tooltip after two seconds
    setTimeout(() => {
      setShowLabel(false);
      setTooltipMessage(TOOL_TIP_MESSAGE);
    }, 2000);
  };

  const conversation = message;

  const formatMagicLink = () => {
    if (!magicLink) return "";

    const url = new URL(magicLink);
    return `${url.origin}...`;
  };

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
            <p className="text-sm mb-2">{`${t(
              "install.app.mobile.metamask.description.one"
            )} ${mobileBrowserToUser} ${t(
              "install.app.mobile.metamask.description.two"
            )}`}</p>
            <div
              className={classNames(
                "cursor-pointer text-xs flex items-center",
                {
                  loading: magicLink === undefined,
                  underline: !!magicLink,
                }
              )}
              style={{ marginLeft: 0, height: 25 }}
              onMouseEnter={() => setShowLabel(true)}
              onMouseLeave={() => setShowLabel(false)}
              onClick={copyToClipboard}
            >
              {magicLink ? (
                <span>{formatMagicLink()}</span>
              ) : (
                <span>{t("generating.link")}</span>
              )}
              {magicLink && (
                <span className="ml-2 flex-none">
                  <CopySvg height={14} />
                </span>
              )}
            </div>
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
            <Button onClick={handleAcknowledge}>{t("no.thanks")}</Button>
            <Button onClick={handleInstall}>{t("lets.go")}</Button>
          </div>
        )}

        {!isMobile && (
          <div>
            <p className="mb-2 text-sm">
              {t("install.app.desktop.description")}
            </p>
            {magicLink === undefined && (
              <p
                className="text-sm loading"
                style={{ marginLeft: 0 }}
              >{`Generating code`}</p>
            )}
            {magicLink === null && (
              <p className="text-sm mb-2" style={{ marginLeft: 0 }}>
                {`${t("error.wentWrong")} ${t("please.try.again")}`}
              </p>
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
