import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import RemarkGfm from "remark-gfm";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  materialLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import "github-markdown-css/github-markdown.css";

// darcula webstorm
// vscDarkPlus vscode暗色主题

type tProps = {
  textContent: string;
  darkMode?: boolean; // markdown文本
  switchRight: boolean;
};

const them = {
  dark: vscDarkPlus,
  light: materialLight,
};

const OmsViewMarkdown = (props: tProps) => {
  const { textContent, darkMode, switchRight } = props;
  const [isSourceCode, setIsSourceCode] = useState<boolean>(false);
  const [isCopy, setIsCopy] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <div
        className="sy-show-switch"
        title={isSourceCode ? "MarkDown" : "Text"}
        onClick={() => {
          setIsSourceCode(!isSourceCode);
        }}
        style={{
          top: "-13px",
          right: switchRight ? "-8px" : "auto",
          left: !switchRight ? "-9px" : "auto",
        }}
      >
        {isSourceCode ? "M" : "T"}
      </div>
      <div>
        {isSourceCode ? (
          <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
            {textContent}
          </pre>
        ) : (
          <ReactMarkdown
            remarkPlugins={[RemarkGfm]}
            className="markdown-body markdown-body-my"
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline ? (
                  <div
                    onMouseLeave={() => {
                      setIsCopy(false);
                    }}
                  >
                    <CopyToClipboard
                      text={String(children).replace(/\n$/, "")}
                      onCopy={() => {
                        setIsCopy(true);
                      }}
                    >
                      <span className="copy-code-button">
                        {isCopy ? "copied" : "copy"}
                      </span>
                    </CopyToClipboard>
                    <SyntaxHighlighter
                      showLineNumbers={false}
                      style={
                        darkMode ? (them.dark as any) : (them.light as any)
                      }
                      language={!inline && match ? match[1] : ""}
                      PreTag="pre"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code className={"sy-code-inline " + className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {textContent}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default OmsViewMarkdown;
