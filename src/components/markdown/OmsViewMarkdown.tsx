import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, materialLight, materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// darcula webstorm
// vscDarkPlus vscode暗色主题

type tProps = {
  textContent: string
  darkMode?: boolean; // markdown文本
}

const them = {
  dark: vscDarkPlus,
  light: materialLight
};

const OmsViewMarkdown = (props: tProps) => {
  const { textContent, darkMode } = props;
  return (
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return  (
            <SyntaxHighlighter
              showLineNumbers={true}
              style={darkMode ? them.dark as any: them.light as any}
              language={(!inline && match) ? match[1] : ""}
              PreTag='div'
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) ;
        }
      }}
    >
      {textContent}
    </ReactMarkdown>
  );
};

export default OmsViewMarkdown;