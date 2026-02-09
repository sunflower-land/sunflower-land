import React, {
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { Modal } from "components/ui/Modal";

import { PIXEL_SCALE } from "features/game/lib/constants";
import mailboxImg from "assets/decorations/mailbox.png";
import newsIcon from "assets/icons/chapter_icon_2.webp";

import classNames from "classnames";

import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Message } from "./components/Message";
import { InnerPanel, OuterPanel, Panel } from "components/ui/Panel";
import { NPC_WEARABLES } from "lib/npcs";
import { getKeys } from "features/game/types/craftables";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import letterDisc from "assets/icons/letter_disc.png";
import giftIcon from "assets/icons/gift.png";
import { MachineState } from "features/game/lib/gameMachine";
import { PWAInstallMessage } from "./components/PWAInstallMessage";
import { useIsPWA } from "lib/utils/hooks/useIsPWA";
import { DiscordNews } from "./components/DiscordNews";
import { DailyRewardClaim } from "features/game/components/DailyReward";
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
  const [tab, setTab] = useState<"news" | "dailyGift">("news");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>();
  const [dismissedUnreadId, setDismissedUnreadId] = useState<string>();
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

  const unreadAnnouncementId = !isVisiting
    ? getKeys(announcements ?? {}).find(
        (id) => !mailbox.read.find((message) => message.id === id),
      )
    : undefined;

  const hasAnnouncement = !!unreadAnnouncementId;

  const discordNewsSubscribe = (onStoreChange: () => void) => {
    if (typeof window === "undefined") return () => {};

    window.addEventListener("storage", onStoreChange);
    window.addEventListener(DISCORD_NEWS_STORAGE_EVENT, onStoreChange);

    return () => {
      window.removeEventListener("storage", onStoreChange);
      window.removeEventListener(DISCORD_NEWS_STORAGE_EVENT, onStoreChange);
    };
  };

  const discordNewsLatestAt = useSyncExternalStore(
    discordNewsSubscribe,
    () => {
      if (typeof window === "undefined") return null;
      return getDiscordNewsLatestAt();
    },
    () => null,
  );

  const discordNewsReadAt = useSyncExternalStore(
    discordNewsSubscribe,
    () => {
      if (typeof window === "undefined") return null;
      return getDiscordNewsReadAt();
    },
    () => null,
  );

  useEffect(() => {
    if (isVisiting) return;

    const token = authState.context.user.rawToken as string | undefined;
    if (!token) return;

    // Cache + timestamps are written to localStorage; UI reacts via useSyncExternalStore.
    preloadDiscordNews({ token });
  }, [authState.context.user.rawToken, isVisiting]);

  const hasUnreadDiscordUpdate = !!(
    discordNewsLatestAt &&
    (!discordNewsReadAt || discordNewsLatestAt > discordNewsReadAt)
  );

  const shouldShowNewsAlert = hasUnreadDiscordUpdate && !isVisiting;

  const activeMessageId =
    selected ??
    (dismissedUnreadId === unreadAnnouncementId
      ? undefined
      : unreadAnnouncementId);
  const details = activeMessageId ? announcements[activeMessageId] : undefined;
  const handleAnnouncementClose = () => {
    if (selected) {
      close();
      return;
    }

    setDismissedUnreadId(unreadAnnouncementId);
  };

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
      <Modal show={isOpen} onHide={close} size="lg">
        {activeMessageId && details && (
          <Panel bumpkinParts={NPC_WEARABLES[details.from]}>
            <div className="flex items-center mb-1 p-1">
              <p className="text-sm capitalize ml-1 underline">
                {details.from}
              </p>
            </div>

            {activeMessageId === "pwa-install-prompt" && !isPWA ? (
              <PWAInstallMessage
                message={details}
                conversationId={activeMessageId}
                read={
                  !!mailbox.read.find((item) => item.id === activeMessageId)
                }
                onAcknowledge={handleAnnouncementClose}
              />
            ) : (
              <Message
                message={details}
                conversationId={activeMessageId}
                read={
                  !!mailbox.read.find((item) => item.id === activeMessageId)
                }
                onClose={handleAnnouncementClose}
              />
            )}
          </Panel>
        )}
        {!activeMessageId && (
          <CloseButtonPanel
            onClose={close}
            tabs={[
              {
                icon: newsIcon,
                name: t("news.title"),
                alert: shouldShowNewsAlert,
                unread: shouldShowNewsAlert,
                id: "news",
              },
              {
                icon: giftIcon,
                name: t("mailbox.dailyGift"),
                id: "dailyGift",
              },
            ]}
            currentTab={tab}
            setCurrentTab={setTab}
            container={OuterPanel}
          >
            {tab === "news" && (
              <InnerPanel>
                <DiscordNews />
              </InnerPanel>
            )}
            {tab === "dailyGift" && (
              <InnerPanel>
                <DailyRewardClaim />
              </InnerPanel>
            )}
          </CloseButtonPanel>
        )}
      </Modal>
    </>
  );
};
