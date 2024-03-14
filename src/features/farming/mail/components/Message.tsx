import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { Message as IMessage } from "features/game/types/announcements";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";

interface Props {
  conversationId: string;
  read?: boolean;
  onAcknowledge?: () => void;
  message: IMessage;
}

const CONTENT_HEIGHT = 300;

export const Message: React.FC<Props> = ({
  conversationId,
  read,
  onAcknowledge,
  message,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [showReward, setShowReward] = useState(false);

  const acknowledge = () => {
    gameService.send({ type: "message.read", id: conversationId });
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
        <>
          <p className="text-center">{t("statements.conversation.one")}</p>

          <div className="flex flex-col items-center">
            {getKeys(conversation.reward?.items).map((name) => (
              <img
                key={`${name}`}
                src={ITEM_DETAILS[name].image}
                className="mb-2 w-1/5 my-2 img-highlight"
              />
            ))}
          </div>

          {/* Text*/}
          <div>
            {getKeys(conversation.reward?.items).map((name) => (
              <p
                key={`${name}`}
                className="text-center text-sm mb-2"
              >{`${conversation.reward?.items[name]} x ${name}`}</p>
            ))}
          </div>

          <Button onClick={acknowledge}>{t("claim")}</Button>
        </>
      );
    }
    return (
      <>
        <div className="">
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
      className="overflow-y-auto divide-brown-600 p-2 pb-0 scrollable"
    >
      <Content />
    </div>
  );
};
