import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import Filter from "bad-words";

interface Props {
  onMessage: (text: string) => void;
}

const MAX_CHARACTERS = 100;

/* eslint-disable */
const URL_REGEX = new RegExp(
  /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi
);
/* eslint-enable */

const ALPHA_REGEX = new RegExp(/^[\w*? -]+$/);

export const ChatText: React.FC<Props> = ({ onMessage }) => {
  const ref = useRef<HTMLTextAreaElement>();
  const [text, setText] = useState("");

  const isUrl = URL_REGEX.test(text);
  const isValidText = text.length === 0 || ALPHA_REGEX.test(text);

  const send = (event?: React.SyntheticEvent) => {
    event?.preventDefault();

    if (text === "" || text.length > MAX_CHARACTERS) {
      return;
    }

    if (isUrl || !isValidText) {
      return;
    }

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

  return (
    <form onSubmit={send}>
      <div
        className="w-full relative mt-2"
        onClick={() => console.log("text div clicked")}
      >
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
          style={{
            border: "1px solid #ead4aa",
            fontFamily: "monospace",
            maxHeight: "180px",
          }}
          placeholder="Type here..."
          className="text-sm placeholder-white w-full rounded-md bg-brown-200 pr-10 pl-2 py-2"
        />

        {text.length > MAX_CHARACTERS && (
          <Label className="mt-3 mb-1 float-right" type="danger">
            {`Max ${MAX_CHARACTERS} characters`}
          </Label>
        )}

        {isUrl && (
          <Label className="mt-3 mb-1 float-right" type="danger">
            {`No URLs allowed`}
          </Label>
        )}

        {!isValidText && (
          <Label className="mt-3 mb-1 float-right" type="danger">
            {`Alphanumeric characters only`}
          </Label>
        )}
        <div
          className="absolute right-1 top-1 cursor-pointer w-8"
          onClick={send}
        >
          <img src={SUNNYSIDE.icons.disc} className="w-8" />
          <img
            src={SUNNYSIDE.icons.expression_chat}
            className="w-4 absolute left-2 top-2"
          />
        </div>
      </div>
    </form>
  );
};
