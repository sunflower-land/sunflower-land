import React, { useState } from "react";
import { Message, Player } from "../ModerationTools";
import { OuterPanel } from "components/ui/Panel";
import { MuteModal } from "../components/Mute";

type Props = {
  messages: Message[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scene?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  authState: any;
  moderatorFarmId: number;
};

export const ChatHistory: React.FC<Props> = ({
  messages,
  scene,
  authState,
  moderatorFarmId,
}) => {
  const [step, setStep] = useState<"MAIN" | "MUTE">("MAIN");
  const [selectedPlayer, setSelectedPlayer] = useState<
    Partial<Player> | undefined
  >();

  const [search, setSearch] = useState("");
  const Messages = messages.filter((message) => {
    if (search.length === 0) {
      return true;
    } else {
      return (
        message.text.toLowerCase().includes(search.toLowerCase()) ||
        message.farmId.toString().includes(search.toLowerCase()) ||
        message.sessionId.toLowerCase().includes(search.toLowerCase()) ||
        (message.username &&
          message.username.toLowerCase().includes(search.toLowerCase()))
      );
    }
  });

  const groupMessagesByFarmId = (messages: Message[]) => {
    if (messages.length === 0) {
      return [];
    }

    const groupedMessages = [];
    let currentGroup = {
      farmId: messages[0].farmId,
      sessionId: messages[0].sessionId,
      messages: [messages[0].text],
      sceneId: messages[0].sceneId,
      sentAt: messages[0].sentAt,
      username: messages[0].username,
    };

    for (let i = 1; i < messages.length; i++) {
      if (messages[i].farmId === currentGroup.farmId) {
        currentGroup.messages.push(messages[i].text);
      } else {
        groupedMessages.push(currentGroup);
        currentGroup = {
          farmId: messages[i].farmId,
          sessionId: messages[i].sessionId,
          messages: [messages[i].text],
          sceneId: messages[i].sceneId,
          sentAt: messages[i].sentAt,
          username: messages[i].username,
        };
      }
    }

    groupedMessages.push(currentGroup);
    return groupedMessages;
  };

  const translateTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <>
      {step === "MAIN" && (
        <>
          <div className="flex flex-col items-start gap-2 ml-1 mt-2 h-96 overflow-y-scroll scrollable">
            {groupMessagesByFarmId(Messages).map((message, index) => (
              <OuterPanel key={index} className="w-full">
                <div className="flex items-center justify-between gap-4">
                  <span
                    className="text-sm cursor-pointer hover:underline"
                    onClick={() => {
                      setSelectedPlayer({
                        farmId: message.farmId,
                        username: message.username,
                      });
                      setStep("MUTE");
                    }}
                  >
                    {message.username || message.farmId}
                  </span>
                  <span className="text-xs">
                    {translateTimestamp(message.sentAt)}
                  </span>
                </div>
                <div className="flex flex-col gap-1 mt-1">
                  {message.messages.map((msg, index) => (
                    <span key={index} className="text-xs break-words">
                      {msg}
                    </span>
                  ))}
                </div>
              </OuterPanel>
            ))}
          </div>
          <div className="flex items-center justify-between m-1">
            <div className="flex items-center gap-1">
              <span className="text-xs">{"Search"}</span>
              <input
                className="w-1/2 text-xs text-shadow rounded-sm shadow-inner shadow-black bg-brown-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <span className="text-xs">{messages.length + " Messages"}</span>
          </div>
        </>
      )}

      {step === "MUTE" && (
        <MuteModal
          onClose={() => setStep("MAIN")}
          player={selectedPlayer}
          authState={authState}
          moderatorFarmId={moderatorFarmId}
          scene={scene}
        />
      )}
    </>
  );
};
