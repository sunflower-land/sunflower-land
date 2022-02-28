import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // url, table, etc support

export const Markdown: React.FC = ({ children }) => {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {children as string}
    </ReactMarkdown>
  );
};
