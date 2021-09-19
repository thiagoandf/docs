import React from 'react';
import PropTypes from 'prop-types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeBlock(props) {
  return (
    <SyntaxHighlighter language={props.language} style={atomDark}>
      {props.children}
    </SyntaxHighlighter>
  );
}

CodeBlock.defaultProps = {
  language: null,
};

CodeBlock.propTypes = {
  children: PropTypes.string,
  language: PropTypes.string,
};
