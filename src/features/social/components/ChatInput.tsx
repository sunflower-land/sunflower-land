import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { pixelChatInputBorderStyle } from "features/game/lib/style";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Button } from "components/ui/Button";

const MAX_CHARACTERS = 96;
const ALPHA_REGEX = new RegExp(/^[\w*?!, '-.!?#]+$/);

type Props = {
  disabled?: boolean;
  onEnter: (message: string) => void;
};

export const ChatInput: React.FC<Props> = ({ disabled, onEnter }) => {
  const { t } = useAppTranslation();
  const [text, setText] = useState("");
  const [debounceButtonTime, setDebounceButtonTime] = useState(0);
  const ref = useRef<HTMLTextAreaElement>(null);

  const isValidText = () => {
    return text.length <= MAX_CHARACTERS && ALPHA_REGEX.test(text);
  };

  useEffect(() => {
    if (debounceButtonTime > 0) {
      setTimeout(() => setDebounceButtonTime(0), debounceButtonTime);
    }
  }, [debounceButtonTime]);

  const handleMessage = () => {
    if (text.trim() !== "" && isValidText()) {
      onEnter(text);
      setText("");
      setDebounceButtonTime(2000);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    event.stopPropagation();

    if (event.key === "Enter") {
      event.preventDefault();
      handleMessage();
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
        onClick={handleMessage}
        disabled={text.length === 0 || !isValidText() || debounceButtonTime > 0}
      >
        {t("message")}
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
