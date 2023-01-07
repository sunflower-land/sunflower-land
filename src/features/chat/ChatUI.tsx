import { Panel } from "components/ui/Panel";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";

import chatIcon from "assets/icons/expression_chat.png";
import disc from "assets/icons/disc.png";

interface Props {
  onMessage: (text: string) => void;
}
export const ChatUI: React.FC<Props> = ({ onMessage }) => {
  const ref = useRef<HTMLTextAreaElement>();
  const [text, setText] = useState("");
  const send = (event?: React.SyntheticEvent) => {
    event?.preventDefault();
    onMessage(text);
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
    <div
      className="w-full flex justify-center fixed bottom-4 pl-2 md:pr-2 pr-20"
      style={{ zIndex: 999, height: "125px" }}
      onClick={() => console.log("parent clicked")}
    >
      <Panel className="md:w-1/2 w-full">
        <form onSubmit={send}>
          <div className="flex items-center">
            <img src={chatIcon} className="h-6 mr-2" />
            <span className="text-sm">Bumpkin chat</span>
          </div>

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

            <img
              src={disc}
              className="absolute right-1 top-1 cursor-pointer w-8"
              onClick={send}
            />
          </div>
        </form>
      </Panel>
    </div>
  );
};
