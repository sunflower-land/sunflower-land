import React, { useContext, useEffect, useState } from "react";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { isMobile, isIOS } from "mobile-device-detect";
import { QRCodeSVG } from "qrcode.react";
import { Context } from "features/game/GameProvider";
import * as AuthProvider from "features/auth/lib/Provider";
import { translate } from "lib/i18n/translate";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { getMagicLink } from "features/auth/actions/magicLink";
import { Label } from "components/ui/Label";
import logo from "assets/brand/icon.png";
import classNames from "classnames";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const TOOL_TIP_MESSAGE = translate("copy.link");

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const _farmId = (state: MachineState) => state.context.farmId;
const _token = (state: AuthMachineState) =>
  state.context.user.rawToken as string;

export const InstallAppModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(Context);
  const [showLabel, setShowLabel] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState(TOOL_TIP_MESSAGE);
  const [magicLink, setMagicLink] = useState<string | null>();

  const { t } = useAppTranslation();

  const farmId = useSelector(gameService, _farmId);
  const token = useSelector(authService, _token);

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
    if (magicLink || !isOpen) return;

    fetchMagicLink();
  }, [isOpen]);

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

  const mobileBrowserToUser = isIOS ? "Safari" : "Chrome";

  return (
    <Modal show={isOpen} onHide={onClose}>
      <CloseButtonPanel title={t("install.app")} onClose={onClose}>
        <div className="p-1">
          {isMobile && (
            <div className="relative space-y-2 text-sm mb-2">
              <p>{`${t(
                "install.app.mobile.description.one"
              )} ${mobileBrowserToUser} ${t(
                "install.app.mobile.description.two"
              )}`}</p>
              <p
                className={classNames("cursor-pointer text-xs underline", {
                  loading: !magicLink,
                })}
                onMouseEnter={() => setShowLabel(true)}
                onMouseLeave={() => setShowLabel(false)}
                onClick={copyToClipboard}
              >
                {magicLink ? t("magic.link") : t("generating.link")}
              </p>
              <div
                className={`absolute top-14 left-9 mr-5 transition duration-400 pointer-events-none ${
                  showLabel ? "opacity-100" : "opacity-0"
                }`}
              >
                <Label type="success">{tooltipMessage}</Label>
              </div>
            </div>
          )}
          {!isMobile && (
            <div>
              <p className="mb-2 text-sm">
                {t("install.app.desktop.description")}
              </p>
              {magicLink === undefined && (
                <p className="text-sm loading" style={{ marginLeft: 0 }}>
                  {t("generating.code")}
                </p>
              )}
              {magicLink === null && (
                <p className="text-sm mb-2" style={{ marginLeft: 0 }}>
                  {`${t("error.wentWrong")} ${t("please.try.again")}`}
                </p>
              )}
              {magicLink && (
                <div className="flex justify-center mb-2">
                  <QRCodeSVG
                    style={{ width: 180, height: 180 }}
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
            </div>
          )}
        </div>
      </CloseButtonPanel>
    </Modal>
  );
};
