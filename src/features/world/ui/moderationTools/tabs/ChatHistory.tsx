import React, { useState } from "react";
import { Message } from "../ModerationTools";

type Props = {
  messages: Message[];
};

export const ChatHistory: React.FC<Props> = ({ messages }) => {
  const [search, setSearch] = useState("");

  const Messages = messages.filter((message) => {
    if (search.length === 0) {
      return true;
    } else {
      return (
        message.text.toLowerCase().includes(search.toLowerCase()) ||
        message.farmId.toString().includes(search.toLowerCase()) ||
        message.sessionId.toLowerCase().includes(search.toLowerCase())
      );
    }
  });

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
              <th className="w-1/2">Time</th>
              <th className="w-1/4">Farm ID</th>
              <th className="w-1/4">Player ID</th>
              <th className="w-1/2">Message</th>
            </tr>
          </thead>
          <tbody>
            {Messages.map((message) => {
              return (
                <tr
                  key={message.sentAt}
                  className="text-xs align-start break-words "
                >
                  <td className="w-1/2">
                    {translateTimestamp(message.sentAt)}
                  </td>
                  <td className="w-1/4">{message.farmId}</td>
                  <td className="w-1/4">{message.sessionId}</td>
                  <td className="w-1/2">{message.text}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between m-1">
        <div className="flex items-center gap-1">
          <span className="text-xs">Search</span>
          <input
            className="w-1/2 text-xs text-shadow rounded-sm shadow-inner shadow-black bg-brown-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="text-xs">{messages.length} Messages</span>
      </div>
    </>
  );
};
