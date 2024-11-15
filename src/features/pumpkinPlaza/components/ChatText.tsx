import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Label } from "components/ui/Label";
import Filter from "bad-words";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SceneId } from "features/world/mmoMachine";

interface Props {
  messages: {
    createdAt: number;
    sceneId: SceneId;
    text: string;
    username: string;
    authorSessionId: string;
    authorId: number;
    messageId: string;
  }[];
  onMessage: (text: string) => void;
  cooledDownAt?: number;
}

const MAX_CHARACTERS = 96;

/* eslint-disable */
const URL_REGEX = new RegExp(
  /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi,
);
/* eslint-enable */

const ALPHA_REGEX = new RegExp(/^[\w*?!, '-]+$/);

export const ChatText: React.FC<Props> = ({
  messages,
  onMessage,
  cooledDownAt,
}) => {
  const ref = useRef<HTMLInputElement>();
  const [text, setText] = useState("");
  const [valid, setValid] = useState(true);

  const cooldown = useCountdown(cooledDownAt ?? 0);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        ref.current.blur();
      }
    };

    const keyDownListener = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        send();
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    window.addEventListener("keydown", keyDownListener);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
      window.removeEventListener("keydown", keyDownListener);
    };
  });
  const { t } = useAppTranslation();
  const Validation = () => {
    if (text.length > MAX_CHARACTERS) {
      return (
        <Label className="mt-1 mb-1 float-right" type="danger">
          {`Max ${MAX_CHARACTERS} characters`}
        </Label>
      );
    }

    const isValidText = text.length === 0 || ALPHA_REGEX.test(text);

    if (!isValidText) {
      return (
        <Label className="mt-1 mb-1 float-right" type="danger">
          {t("warning.chat.noSpecialCharacters")}
        </Label>
      );
    }

    return null;
  };

  const isValid = () => {
    const isValidText = text.length <= MAX_CHARACTERS && ALPHA_REGEX.test(text);
    setValid(isValidText);
  };

  const send = (event?: React.SyntheticEvent) => {
    event?.preventDefault();

    if (text?.trim() === "") {
      setText("");
      return;
    }

    const filter = new Filter();
    const sanitized = filter.clean(text);
    onMessage(sanitized);
    setText("");
  };

  const hasMessages = messages.length > 0;

  const showCooldown = cooldown?.minutes > 0 || cooldown?.seconds > 0;

  return (
    <form onSubmit={send}>
      <div
        className={classNames(
          "bg-gray-900 bg-opacity-25 relative rounded-md w-64 sm:w-96 pt-1",
          { "mt-2": hasMessages },
        )}
        style={{ lineHeight: "10px", fontSize: "14px" }}
      >
        <div
          className={classNames(
            "min-h-[60px] max-h-48 overflow-y-scroll flex flex-col-reverse break-words text-xs p-2 text-shadow",
            { "mb-1": hasMessages },
          )}
        >
          {messages
            .slice(0, 1000)
            .reverse()
            .map((message, i) => {
              if (!message.authorId)
                return (
                  <p key={`${i}-${message.text}`} className="text-amber-300">
                    {message.text}
                  </p>
                );

              if (message.username)
                return (
                  <p key={`${i}-${message.authorId}`} className="text-white">
                    {`${message.username}: ${message.text}`}
                  </p>
                );

              return (
                <p
                  key={`${i}-${message.authorId}`}
                  className="pt-0.5 -indent-6 pl-6 text-white"
                >
                  {`${message.authorId}: ${message.text}`}
                </p>
              );
            })}
        </div>
        {showCooldown && (
          <Label type="warning" className="flex p-1 m-1 mx-2">
            <img src={SUNNYSIDE.icons.timer} className="h-4 pr-1" />
            <p className="text-xs">{`Cooldown - ${cooldown.minutes} mins ${cooldown.seconds} secs`}</p>
          </Label>
        )}

        <input
          maxLength={MAX_CHARACTERS * 2}
          disabled={showCooldown}
          data-prevent-drag-scroll
          name="message"
          autoComplete="off"
          value={text}
          ref={(r) => (ref.current = r as HTMLInputElement)}
          onClick={() => {
            ref.current?.focus();
          }}
          onInput={(e: ChangeEvent<HTMLInputElement>) => {
            setText(e.target.value);
            isValid();
            e.preventDefault();
          }}
          placeholder="Type here..."
          className=" placeholder-white text-white text-shadow text-xs text-shadow w-full !bg-black !bg-opacity-10 px-2 py-2 rounded-md max-h-min"
        />
        <Validation />
      </div>
    </form>
  );
};
