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
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import giftIcon from "assets/icons/gift.png";
import { DiscordNews } from "./components/DiscordNews";
import { DailyRewardClaim } from "features/game/components/DailyReward";
import { useAuth } from "features/auth/lib/Provider";
import {
  DISCORD_NEWS_STORAGE_EVENT,
  getDiscordNewsLatestAt,
  getDiscordNewsReadAt,
  preloadDiscordNews,
} from "./actions/discordNews";

export const LetterBox: React.FC = () => {
  const { gameService, showAnimations } = useContext(Context);
  const { authState } = useAuth();
  const [tab, setTab] = useState<"news" | "dailyGift">("news");
  const [isOpen, setIsOpen] = useState(false);

  const isVisiting = useSelector(gameService, (state) =>
    state.matches("visiting"),
  );

  const { t } = useAppTranslation();
  const close = () => {
    setIsOpen(false);
  };

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
        {shouldShowNewsAlert && (
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
      </Modal>
    </>
  );
};
