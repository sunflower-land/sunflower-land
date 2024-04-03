import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import { Message as IMessage } from "features/game/types/announcements";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";

interface Props {
  conversationId: string;
  read?: boolean;
  onAcknowledge?: () => void;
  message: IMessage;
  onClose: () => void;
}

const CONTENT_HEIGHT = 300;

export const Message: React.FC<Props> = ({
  conversationId,
  read,
  onAcknowledge,
  onClose,
  message,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [showReward, setShowReward] = useState(false);

  const acknowledge = () => {
    gameService.send({ type: "message.read", id: conversationId });
    onClose();
  };

  const conversation = message;

  const next = () => {
    if (conversation.reward && !read) {
      setShowReward(true);
      return;
    }

    acknowledge();
    onAcknowledge?.();
  };
  const Content = () => {
    if (showReward && conversation.reward) {
      return (
        <ClaimReward
          onClaim={acknowledge}
          reward={{
            createdAt: Date.now(),
            id: "mail-bonus",
            items: conversation.reward.items,
            wearables: {},
            sfl: 0,
            coins: conversation.reward.coins ?? 0,
          }}
        />
      );
    }
    return (
      <>
        <div className="">
          {conversation.content.map((content, index) => (
            <div className="mb-2" key={index}>
              <p className="text-sm px-1 mb-2">{content.text}</p>
              {content.image && (
                <img
                  src={content.image}
                  className="w-full mx-auto rounded-md mt-1"
                />
              )}
            </div>
          ))}
        </div>

        {!read && (
          <Button onClick={next}>
            {!!conversation.reward && !read ? t("open.gift") : t("gotIt")}
          </Button>
        )}

        {/* Links */}
        {conversation.link && (
          <a
            href={conversation.link}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-xxs pb-1 pt-0.5 hover:text-blue-500 mb-2"
          >
            {t("read.more")}
          </a>
        )}
      </>
    );
  };

  return (
    <div
      style={{ maxHeight: CONTENT_HEIGHT }}
      className="overflow-y-auto divide-brown-600 pb-0 scrollable"
    >
      <Content />
    </div>
  );
};
