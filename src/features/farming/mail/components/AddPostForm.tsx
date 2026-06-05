import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "@xstate/react";

import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { TextInput } from "components/ui/TextInput";
import { Loading } from "features/auth/components";

import { useGame } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ERRORS } from "lib/errors";
import { ITEM_DETAILS } from "features/game/types/images";
import type { MachineState } from "features/game/lib/gameMachine";

const _showcasing = (state: MachineState) => state.matches("showcasingTwitter");
const _success = (state: MachineState) =>
  state.matches("showcasingTwitterSuccess");
const _failed = (state: MachineState) =>
  state.matches("showcasingTwitterFailed");
const _errorCode = (state: MachineState) => state.context.errorCode;

interface Props {
  show: boolean;
  onClose: () => void;
  /** Called once a post is successfully showcased, so the mailbox can return
   * to the feed and refetch it (the new post then loads into the list). */
  onSuccess: () => void;
}

export const AddPostForm: React.FC<Props> = ({ show, onClose, onSuccess }) => {
  const { gameService } = useGame();
  const { t } = useAppTranslation();

  // The showcase effect runs through the game machine, but the global effect
  // overlay is hidden for these states (see Game.tsx SHOW_MODAL), so we render
  // the loading / error states inline here instead.
  const showcasing = useSelector(gameService, _showcasing);
  const success = useSelector(gameService, _success);
  const failed = useSelector(gameService, _failed);
  const errorCode = useSelector(gameService, _errorCode);

  const [url, setUrl] = useState<string>("");
  const handledRef = useRef(false);

  // A successful showcase always resets the machine and returns to the feed.
  // The parent remounts this form afterwards (via `key`), clearing the input.
  useEffect(() => {
    if (success && !handledRef.current) {
      handledRef.current = true;
      gameService.send("CONTINUE");
      onSuccess();
    }
    if (!success) {
      handledRef.current = false;
    }
  }, [success, gameService, onSuccess]);

  // If the showcase failed after the form was closed, reset so the machine
  // isn't left stuck in the failed state.
  useEffect(() => {
    if (failed && !show) {
      gameService.send("CONTINUE");
    }
  }, [failed, show, gameService]);

  const submit = () => {
    gameService.send("twitter.showcased", {
      effect: {
        type: "twitter.showcased",
        url,
      },
    });
  };

  // Return from the error state back to the form so the admin can fix the link.
  const tryAgain = () => {
    gameService.send("CONTINUE");
  };

  const renderBody = () => {
    if (showcasing) {
      return <Loading text={t("showcasing.twitter")} />;
    }

    if (failed) {
      let message = t("community.showcase.error.invalidUrl");
      if (errorCode === ERRORS.TWITTER_NOT_CONNECTED) {
        message = t("community.showcase.error.notConnected");
      } else if (errorCode === ERRORS.TWITTER_ALREADY_SHOWCASED) {
        message = t("community.showcase.error.alreadyShowcased");
      }

      return (
        <div className="p-1">
          <Label type="danger" className="mb-2">
            {t("community.showcase.error.title")}
          </Label>
          <p className="text-sm mb-3">{message}</p>
          <Button onClick={tryAgain}>{t("community.addPost.tryAgain")}</Button>
        </div>
      );
    }

    return (
      <div className="p-1">
        <Label type="default" className="mb-2">
          {t("community.addPost.title")}
        </Label>
        <p className="text-xs mb-2">{t("community.addPost.description")}</p>
        <div className="flex items-center mb-2">
          <img
            src={ITEM_DETAILS["Love Charm"].image}
            className="h-5 mr-1"
            alt="Love Charm"
          />
          <span className="text-xxs">{t("community.addPost.reward")}</span>
        </div>
        <TextInput
          placeholder={t("community.addPost.placeholder")}
          value={url}
          onValueChange={(value) => setUrl(value)}
        />
        <div className="flex gap-1 mt-2">
          <Button onClick={onClose}>{t("back")}</Button>
          <Button disabled={!url} onClick={submit}>
            {t("community.addPost.submit")}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Modal show={show} onHide={onClose}>
      <CloseButtonPanel onClose={onClose}>{renderBody()}</CloseButtonPanel>
    </Modal>
  );
};
