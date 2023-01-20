import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import Filter from "bad-words";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  onMessage: (text: string) => void;
}

export const ChatText: React.FC<Props> = ({ onMessage }) => {
  const ref = useRef<HTMLTextAreaElement>();
  const [text, setText] = useState("");

  const send = (event?: React.SyntheticEvent) => {
    event?.preventDefault();

    if (text === "") {
      return;
    }

    const filter = new Filter();

    const sanitized = filter.clean(text);
    onMessage(sanitized);
    setText("");
  };

  useEffect(() => {
    const keyDownListener = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        send();
      }
    };

    window.addEventListener("keydown", keyDownListener);

    return () => window.removeEventListener("keydown", keyDownListener);
  });

  return (
    <form onSubmit={send}>
      <div
        className="w-full relative mt-2"
        onClick={() => console.log("text div clicked")}
      >
        <textarea
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
          }}
          placeholder="Type here..."
          className="text-sm placeholder-white w-full  mono rounded-md  bg-brown-200 pr-10 pl-2 py-2"
        />

        {text.length > 100 && (
          <Label className="mt-2 mb-1 float-right" type="danger">
            Max 100 characters
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
