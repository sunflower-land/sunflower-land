import React, { ChangeEvent, useContext, useRef, useState } from "react";
import { pixelChatInputBorderStyle } from "features/game/lib/style";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Button } from "components/ui/Button";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { FarmInteraction } from "../PlayerModal";

const MAX_CHARACTERS = 96;
const ALPHA_REGEX = new RegExp(/^[\w*?!, '-.!?#]+$/);

type Props = {
  disabled?: boolean;
  onEnter: (interaction: FarmInteraction) => void;
};

const _username = (state: MachineState) => state.context.state.username;

export const ChatInput: React.FC<Props> = ({ disabled, onEnter }) => {
  const { gameService } = useContext(Context);
  const [text, setText] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  const username = useSelector(gameService, _username);

  const isValidText = () => {
    return text.length <= MAX_CHARACTERS && ALPHA_REGEX.test(text);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    event.stopPropagation();

    if (event.key === "Enter") {
      event.preventDefault();
      if (text.trim() !== "" && isValidText()) {
        onEnter({
          id: `${Date.now()}`,
          text,
          sender: username,
          type: "comment",
          timestamp: Date.now(),
        });
        setText("");
      }
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <textarea
        style={{
          ...pixelChatInputBorderStyle,
          background: "#fff0d4",
          borderRadius: "0",
          outline: "none",
          height: "47px",
        }}
        maxLength={MAX_CHARACTERS}
        disabled={disabled}
        data-prevent-drag-scroll
        name="message"
        autoComplete="off"
        value={text}
        ref={ref}
        onKeyDown={handleKeyDown}
        onClick={() => {
          ref.current?.focus();
        }}
        onInput={(e: ChangeEvent<HTMLTextAreaElement>) => {
          setText(e.target.value);
          isValidText();
          e.preventDefault();
        }}
        className="text-xs w-full px-2 py-2 max-h-min focus:outline-none focus:ring-0"
      />
      <Validation text={text} />
      <Button
        onClick={() =>
          onEnter({
            id: `${Date.now()}`,
            text,
            sender: username,
            type: "comment",
            timestamp: Date.now(),
          })
        }
        disabled={text.length === 0}
      >
        {`Message`}
      </Button>
    </div>
  );
};

export const Validation = ({ text }: { text: string }) => {
  const { t } = useAppTranslation();

  if (text.length > MAX_CHARACTERS) {
    return (
      <div className="text-error text-xxs pr-1 pb-1 text-right">
        {`Max ${MAX_CHARACTERS} characters`}
      </div>
    );
  }

  const isValidText = text.length === 0 || ALPHA_REGEX.test(text);

  if (!isValidText) {
    return (
      <div className="text-error text-xxs pr-1 pb-1 text-right">
        {t("warning.chat.noSpecialCharacters")}
      </div>
    );
  }

  return null;
};
