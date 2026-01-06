import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { Modal } from "components/ui/Modal";

import { PIXEL_SCALE } from "features/game/lib/constants";
import mailboxImg from "assets/decorations/mailbox.png";
import newsIcon from "assets/icons/chapter_icon_2.webp";

import classNames from "classnames";

import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import { Mail } from "./components/Mail";
import { Message } from "./components/Message";
import { InnerPanel, OuterPanel, Panel } from "components/ui/Panel";
import { NPC_WEARABLES } from "lib/npcs";
import { getKeys } from "features/game/types/craftables";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import letterDisc from "assets/icons/letter_disc.png";
import letter from "assets/icons/letter.png";
import { MachineState } from "features/game/lib/gameMachine";
import { PWAInstallMessage } from "./components/PWAInstallMessage";
import { useIsPWA } from "lib/utils/hooks/useIsPWA";
import { WhatsOn } from "./components/WhatsOn";
import { hasReadNews, News } from "./components/News";
import { hasFeatureAccess } from "lib/flags";
import { DiscordNews } from "./components/DiscordNews";
import { useAuth } from "features/auth/lib/Provider";
import {
  DISCORD_NEWS_STORAGE_EVENT,
  getDiscordNewsLatestAt,
  getDiscordNewsReadAt,
  preloadDiscordNews,
} from "./actions/discordNews";

const _announcements = (state: MachineState) => state.context.announcements;
const _mailbox = (state: MachineState) => state.context.state.mailbox;

export const LetterBox: React.FC = () => {
  const { gameService, showAnimations } = useContext(Context);
  const { authState } = useAuth();
  const [tab, setTab] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>();
  const isPWA = useIsPWA();

  const announcements = useSelector(gameService, _announcements);
  const mailbox = useSelector(gameService, _mailbox);
  const isVisiting = useSelector(gameService, (state) =>
    state.matches("visiting"),
  );

  const { t } = useAppTranslation();
  const close = () => {
    setSelected(undefined);
    setIsOpen(false);
  };

  const hasAnnouncement =
    getKeys(announcements ?? {})
      // Ensure they haven't read it already
      .some((id) => !mailbox.read.find((message) => message.id === id)) &&
    // And not visiting
    !isVisiting;

  const discordNewsEnabled = hasFeatureAccess(
    gameService.state.context.state,
    "DISCORD_NEWS",
  );

  const discordNewsSubscribe = useMemo(
    () => (onStoreChange: () => void) => {
      if (typeof window === "undefined") return () => {};
      if (!discordNewsEnabled) return () => {};

      window.addEventListener("storage", onStoreChange);
      window.addEventListener(DISCORD_NEWS_STORAGE_EVENT, onStoreChange);

      return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener(DISCORD_NEWS_STORAGE_EVENT, onStoreChange);
      };
    },
    [discordNewsEnabled],
  );

  const discordNewsLatestAt = useSyncExternalStore(
    discordNewsSubscribe,
    () => {
      if (typeof window === "undefined" || !discordNewsEnabled) return null;
      return getDiscordNewsLatestAt();
    },
    () => null,
  );

  const discordNewsReadAt = useSyncExternalStore(
    discordNewsSubscribe,
    () => {
      if (typeof window === "undefined" || !discordNewsEnabled) return null;
      return getDiscordNewsReadAt();
    },
    () => null,
  );

  useEffect(() => {
    if (!discordNewsEnabled) return;
    if (isVisiting) return;

    const token = authState.context.user.rawToken as string | undefined;
    if (!token) return;

    // Cache + timestamps are written to localStorage; UI reacts via useSyncExternalStore.
    preloadDiscordNews({ token });
  }, [discordNewsEnabled, authState.context.user.rawToken, isVisiting]);

  const hasUnreadDiscordUpdate = !!(
    discordNewsEnabled &&
    discordNewsLatestAt &&
    (!discordNewsReadAt || discordNewsLatestAt > discordNewsReadAt)
  );
  const hasUnreadNewsUpdate = discordNewsEnabled
    ? hasUnreadDiscordUpdate
    : !hasReadNews();

  const shouldShowNewsAlert = hasUnreadNewsUpdate && !isVisiting;
  const details = selected ? announcements[selected] : undefined;

  return (
    <>
      <div
        className="absolute cursor-pointer hover:img-highlight group"
        id="letterbox"
        onClick={() => setIsOpen(true)}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          height: `${PIXEL_SCALE * 16}px`,
        }}
      >
        {hasAnnouncement && (
          <img
            src={letterDisc}
            className={
              "absolute z-20 cursor-pointer group-hover:img-highlight" +
              (showAnimations ? " animate-pulsate" : "")
            }
            style={{
              width: `${PIXEL_SCALE * 18}px`,
              top: `${PIXEL_SCALE * -14}px`,
              left: `${PIXEL_SCALE * 0}px`,
            }}
          />
        )}

        {shouldShowNewsAlert && !hasAnnouncement && (
          <img
            src={newsIcon}
            className={
              "absolute z-20 cursor-pointer group-hover:img-highlight" +
              (showAnimations ? " animate-pulsate" : "")
            }
            style={{
              width: `${PIXEL_SCALE * 13}px`,
              top: `${PIXEL_SCALE * -13}px`,
              left: `${PIXEL_SCALE * 1.8}px`,
            }}
          />
        )}

        <img
          src={mailboxImg}
          className={classNames("absolute pointer-events-none")}
          style={{
            width: `${PIXEL_SCALE * 8}px`,
            top: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 4}px`,
          }}
        />
      </div>
      <Modal show={isOpen} onHide={close}>
        {selected && details && (
          <Panel bumpkinParts={NPC_WEARABLES[details.from]}>
            <div className="flex items-center mb-1 p-1">
              <img
                src={SUNNYSIDE.icons.arrow_left}
                className="mr-2 cursor-pointer"
                style={{
                  width: `${PIXEL_SCALE * 11}px`,
                }}
                onClick={() => setSelected(undefined)}
              />
              <p className="text-sm capitalize ml-1 underline">
                {details.from}
              </p>
            </div>

            {selected === "pwa-install-prompt" && !isPWA ? (
              <PWAInstallMessage
                message={details}
                conversationId={selected}
                read={!!mailbox.read.find((item) => item.id === selected)}
                onAcknowledge={close}
              />
            ) : (
              <Message
                message={details}
                conversationId={selected}
                read={!!mailbox.read.find((item) => item.id === selected)}
                onClose={close}
              />
            )}
          </Panel>
        )}
        {!selected && (
          <CloseButtonPanel
            onClose={close}
            tabs={[
              {
                icon: letter,
                name: t("mailbox"),
                alert: hasAnnouncement,
                unread: hasAnnouncement,
              },
              {
                icon: newsIcon,
                name: t("news.title"),
                alert: shouldShowNewsAlert,
                unread: shouldShowNewsAlert,
              },

              { icon: SUNNYSIDE.icons.stopwatch, name: t("mailbox.whatsOn") },
            ]}
            currentTab={tab}
            setCurrentTab={setTab}
            container={OuterPanel}
          >
            {tab === 0 && (
              <Mail setSelected={setSelected} announcements={announcements} />
            )}
            {tab === 1 && (
              <InnerPanel>
                {hasFeatureAccess(
                  gameService.state.context.state,
                  "DISCORD_NEWS",
                ) ? (
                  <DiscordNews />
                ) : (
                  <News />
                )}
              </InnerPanel>
            )}

            {tab === 2 && <WhatsOn />}
          </CloseButtonPanel>
        )}
      </Modal>
    </>
  );
};
