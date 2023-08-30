import React from "react";
import { Message } from "../ModerationTools";

type Props = {
  messages: Message[];
};

export const ChatHistory: React.FC<Props> = ({ messages }) => {
  const translateTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <>
      <div className="flex items-start gap-2 ml-1 mt-2 h-96 overflow-y-scroll scrollable">
        <table className="w-full text-xs table-fixed">
          <thead className="text-sm">
            <tr>
              <th className="w-1/4">Time</th>
              <th className="w-1/4">Farm ID</th>
              <th className="w-1/4">Player ID</th>
              <th className="w-full">Message</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => {
              return (
                <tr key={message.sentAt}>
                  <td className="w-1/4">
                    {translateTimestamp(message.sentAt)}
                  </td>
                  <td className="w-1/4">{message.farmId}</td>
                  <td className="w-1/4">{message.sessionId}</td>
                  <td className="w-full">{message.text}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end m-1">
        <span className="text-xs">{messages.length} Messages</span>
      </div>
    </>
  );
};
