import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactHTMLParser from "react-html-parser";
import Articles from "@/models/articles";

export default function Article({ article }: { article: Articles }) {
  const isSyntaxNode = (node: any) =>
    node.type === "tag" &&
    node.name === "pre" &&
    node.attribs &&
    node.attribs.class === "ql-syntax";

  const highlightSyntax = (node: any) => {
    if (isSyntaxNode(node)) {
      const code = node.children[0].data;
      return (
        <SyntaxHighlighter language="javascript" style={dracula}>
          {code}
        </SyntaxHighlighter>
      );
    }
    return undefined;
  };

  return (
    <div className="article_content">
      {ReactHTMLParser(article.content as string, {
        transform: highlightSyntax,
      })}
    </div>
  );
}
