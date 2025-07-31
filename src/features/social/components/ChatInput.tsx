import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { pixelChatInputBorderStyle } from "features/game/lib/style";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Button } from "components/ui/Button";

const MAX_CHARACTERS = 96;

// Custom validation function that allows emojis and common characters
const isValidText = (text: string) => {
  // Check character limit
  if (text.length > MAX_CHARACTERS) return false;

  // Allow empty text
  if (text.length === 0) return true;

  // Check for control characters (excluding common whitespace)
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    // Allow common characters: letters, numbers, punctuation, emojis, and common symbols
    if (charCode < 32 && charCode !== 9 && charCode !== 10 && charCode !== 13) {
      return false; // Control character found
    }
    if (charCode === 127) {
      return false; // DEL character
    }
  }

  return true;
};

// Quick emoji responses
const QUICK_EMOJIS = ["🙂", "😍", "😂", "👍", "👋", "🚀", "🔥"];

type Props = {
  disabled?: boolean;
  onEnter: (message: string) => void;
};

export const ChatInput: React.FC<Props> = ({ disabled, onEnter }) => {
  const { t } = useAppTranslation();
  const [text, setText] = useState("");
  const [debounceButtonTime, setDebounceButtonTime] = useState(0);
  const ref = useRef<HTMLTextAreaElement>(null);

  const checkValidText = () => {
    return isValidText(text);
  };

  useEffect(() => {
    if (debounceButtonTime > 0) {
      setTimeout(() => setDebounceButtonTime(0), debounceButtonTime);
    }
  }, [debounceButtonTime]);

  const handleMessage = () => {
    if (text.trim() !== "" && checkValidText()) {
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

  const handleEmojiClick = (emoji: string) => {
    const newText = text + emoji;
    if (newText.length <= MAX_CHARACTERS) {
      setText(newText);
      ref.current?.focus();
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
          height: "50px",
          lineHeight: 1,
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
          checkValidText();
          e.preventDefault();
        }}
        className="text-xs w-full px-2 py-2 max-h-min focus:outline-none focus:ring-0"
      />
      <Validation text={text} />
      {/* Quick Emoji Row */}
      <div className="flex items-center gap-1 px-2 py-1 mt-1">
        <div className="flex gap-1 justify-between w-full flex-wrap">
          {QUICK_EMOJIS.map((emoji, index) => (
            <button
              key={index}
              onClick={() => handleEmojiClick(emoji)}
              disabled={disabled}
              className="flex items-center justify-center text-sm hover:bg-brown-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-xs">{emoji}</span>
            </button>
          ))}
        </div>
      </div>
      <Button
        onClick={handleMessage}
        disabled={
          text.length === 0 || !checkValidText() || debounceButtonTime > 0
        }
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

  const textIsValid = text.length === 0 || isValidText(text);

  if (!textIsValid) {
    return (
      <div className="text-error text-xxs pr-1 pb-1 text-right">
        {t("warning.chat.noSpecialCharacters")}
      </div>
    );
  }

  return null;
};
