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
  const [magicLink, setMagicLink] = useState<string>();

  const pwaInstall = usePWAInstall();

  const farmId = useSelector(gameService, _farmId);
  const token = useSelector(authService, _token);

  const fetchMagicLink = async () => {
    const { link } = await getMagicLink({
      token,
      farmId,
    });

    setMagicLink(link);
  };

  useEffect(() => {
    if (magicLink) return;

    fetchMagicLink();
  }, []);

  const acknowledge = () => {
    gameService.send({ type: "message.read", id: conversationId });
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
            {content.image && (
              <img
                src={content.image}
                className="w-full mx-auto rounded-md mt-1"
              />
            )}
          </div>
        ))}

        {/* If user is in metamask browser show a link and direct them to open up in relevant browser */}

        {magicLink && (
          <div className="relative w-full">
            <p
              className="cursor-pointer text-sm underline"
              onMouseEnter={() => setShowLabel(true)}
              onMouseLeave={() => setShowLabel(false)}
            >{`Magic Link`}</p>
            <div
              className={`absolute top-6 left-9 mr-5 transition duration-400 pointer-events-none ${
                showLabel ? "opacity-100" : "opacity-0"
              }`}
            >
              <Label type="success">{tooltipMessage}</Label>
            </div>
          </div>
        )}

        {/* If user is in correct browser then show the install button */}
        <Button
          onClick={() => {
            pwaInstall.current?.showDialog(true);
            onAcknowledge();
          }}
        >{`Install`}</Button>

        {!read && <Button onClick={acknowledge}>{t("gotIt")}</Button>}
      </>
    </div>
  );
};
