/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import {
  isMobile,
  isIOS,
  isChrome,
  isSafari,
  isAndroid,
} from "mobile-device-detect";
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
import { CopySvg } from "components/ui/CopyField";
import clipboard from "clipboard";

const TOOL_TIP_MESSAGE = translate("copy.link");

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const _farmId = (state: MachineState) => state.context.farmId;
const _token = (state: AuthMachineState) =>
  state.context.user.rawToken as string;

export const InstallAppModal: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(Context);

  const [magicLink, setMagicLink] = useState<string | null>();

  const { t } = useAppTranslation();

  const farmId = useSelector(gameService, _farmId);
  const token = useSelector(authService, _token);

  const isWeb3MobileBrowser = isMobile && !!window.ethereum;
  const showMagicLinkFlow =
    isWeb3MobileBrowser || (isAndroid && !isChrome) || (isIOS && !isSafari);
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

  return (
    <div className="p-1">
      {isMobile && showMagicLinkFlow && <MagicLinkFlow magicLink={magicLink} />}
      {showQRCodeFlow && <QRCodeFlow magicLink={magicLink} />}
    </div>
  );
};

export const QRCodeFlow = ({ magicLink }: { magicLink?: string | null }) => {
  const { t } = useAppTranslation();

  return (
    <div>
      <p className="mb-2 text-sm">{t("install.app.desktop.description")}</p>
      <Label className="mt-1" type="warning">
        {t("do.not.share.code")}
      </Label>
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
        <>
          <div className="flex my-2">
            <QRCodeSVG
              style={{ width: 250, height: 250 }}
              level="L"
              value={magicLink}
              imageSettings={{
                src: logo,
                height: 20,
                width: 20,
                excavate: false,
              }}
            />
          </div>
          {/* FINISH THIS PART HERE */}
          <div className="space-y-2 mt-4">
            <p className="text-sm">{t("qr.code.not.working")}</p>
            <MagicLinkFlow magicLink={magicLink} showInstructions={false} />
          </div>
        </>
      )}
    </div>
  );
};

export const MagicLinkFlow = ({
  magicLink,
  showInstructions = true,
}: {
  magicLink?: string | null;
  showInstructions?: boolean;
}) => {
  const [showLabel, setShowLabel] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState(TOOL_TIP_MESSAGE);
  const { t } = useAppTranslation();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(magicLink as string);

      setShowLabel(true);
      setTooltipMessage(translate("copied"));
    } catch (e: unknown) {
      try {
        // Try fallback copy to clipboard - uses deprecated API
        clipboard.copy(magicLink as string);
      } catch (e: unknown) {
        setShowLabel(true);
        setTooltipMessage(typeof e === "string" ? e : translate("copy.failed"));
      }
    }

    // Close tooltip after two seconds
    setTimeout(() => {
      setShowLabel(false);
      setTooltipMessage(TOOL_TIP_MESSAGE);
    }, 2000);
  };

  const formatMagicLink = () => {
    if (!magicLink) return "";

    const url = new URL(magicLink);
    return `${url.origin}...`;
  };

  const mobileBrowserToUser = isIOS ? "Safari" : "Chrome";

  return (
    <div className="w-full mb-2">
      {showInstructions && (
        <>
          <p className="text-sm mb-2">
            {t("install.app.mobile.metamask.description", {
              browser: mobileBrowserToUser,
            })}
          </p>
          <Label type="warning">{t("do.not.share.link")}</Label>
        </>
      )}
      <div
        className={classNames(
          "relative cursor-pointer text-xs flex items-center my-2",
          {
            loading: magicLink === undefined,
            underline: !!magicLink,
          },
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
        <div
          className={`absolute top-[-31px] right-6 mr-5 transition duration-400 pointer-events-none ${
            showLabel ? "opacity-100" : "opacity-0"
          }`}
        >
          <Label type="success">{tooltipMessage}</Label>
        </div>
      </div>
    </div>
  );
};
