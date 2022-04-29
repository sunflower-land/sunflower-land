import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // url, table, etc support
import { SpecialComponents } from "react-markdown/lib/ast-to-react";
import { NormalComponents } from "react-markdown/lib/complex-types";

interface Props {
  children: React.ReactNode;
  className?: string;
  components?:
    | Partial<
        Omit<NormalComponents, keyof SpecialComponents> & SpecialComponents
      >
    | undefined;
}

export const Markdown: React.FC<Props> = ({
  children,
  className,
  components,
}) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={components}
      className={className}
    >
      {children as string}
    </ReactMarkdown>
  );
};
