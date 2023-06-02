import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import Filter from "bad-words";
import classNames from "classnames";

interface Props {
  messages: { sessionId: string; text: string }[];
  onMessage: (text: string) => void;
}

const MAX_CHARACTERS = 48;

/* eslint-disable */
const URL_REGEX = new RegExp(
  /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi
);
/* eslint-enable */

const ALPHA_REGEX = new RegExp(/^[\w*?!, '-]+$/);

export const ChatText: React.FC<Props> = ({ messages, onMessage }) => {
  const ref = useRef<HTMLTextAreaElement>();
  const [text, setText] = useState("");

  const isUrl = URL_REGEX.test(text);
  const isValidText = text.length === 0 || ALPHA_REGEX.test(text);

  const send = (event?: React.SyntheticEvent) => {
    event?.preventDefault();

    if (text?.trim() === "") {
      setText("");
      return;
    }

    // if (text.length > MAX_CHARACTERS) {
    //   return;
    // }

    // if (isUrl || !isValidText) {
    //   return;
    // }

    const filter = new Filter();
    const sanitized = filter.clean(text);
    onMessage(sanitized);
    setText("");
  };

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

  const hasMessages = messages.length > 0;

  return (
    <form onSubmit={send}>
      <div
        className={classNames(
          " bg-black bg-opacity-10 relative rounded-md w-64",
          { "mt-2": hasMessages }
        )}
        style={{ lineHeight: "10px" }}
        onClick={() => console.log("text div clicked")}
      >
        <div
          className={classNames(
            "max-h-48 overflow-y-scroll flex flex-col-reverse break-words",
            { "mb-2": hasMessages }
          )}
        >
          {messages.slice(0, 1000).map((message, i) => (
            <p
              key={i}
              className="text-xxs pt-0.5 -indent-6 pl-6"
              style={{ fontFamily: "monospace", textShadow: "none" }}
            >
              {message.sessionId}: {message.text}
            </p>
          ))}
        </div>
        <textarea
          maxLength={MAX_CHARACTERS * 2}
          data-prevent-drag-scroll
          name="message"
          value={text}
          disabled={false}
          ref={(r) => (ref.current = r as HTMLTextAreaElement)}
          onFocus={() => console.log("Focus")}
          onClick={() => ref.current?.focus()}
          onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setText(e.target.value)
          }
          // style={
          //   {
          //     // border: "1px solid #ead4aa",
          //     // fontFamily: "monospace",
          //     // minHeight: "40px",
          //     // maxHeight: "160px",
          //   }
          // }
          placeholder="Type here..."
          className="text-xxs placeholder-white w-full bg-black bg-opacity-10 pt-1 pr-20 rounded-md"
          style={{ lineHeight: "10px", fontFamily: "monospace" }}
        />

        {/* {text.length > MAX_CHARACTERS && (
          <Label className="mt-3 mb-1 float-right" type="danger">
            {`Max ${MAX_CHARACTERS} characters`}
          </Label>
        )} */}

        {/* {isUrl && (
          <Label className="mt-3 mb-1 float-right" type="danger">
            {`No URLs allowed`}
          </Label>
        )} */}

        {!isValidText && (
          <Label className="mt-3 mb-1 float-right" type="danger">
            {`Alphanumeric characters only`}
          </Label>
        )}
        <div
          className="absolute right-1 bottom-1 cursor-pointer w-8 flex justify-end"
          onClick={send}
        >
          <img src={SUNNYSIDE.icons.disc} className="w-4" />
          <img
            src={SUNNYSIDE.icons.expression_chat}
            className="w-2 absolute right-1 top-1"
          />
        </div>
      </div>
    </form>
  );
};
