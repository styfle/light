import React from 'react';
import PropTypes from 'prop-types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

export default class CodeBlock extends React.PureComponent {
  static propTypes = {
    value: PropTypes.string.isRequired,
    language: PropTypes.string,
  }

  static defaultProps = {
    language: null,
  }

  render() {
    const { language, value } = this.props;

    return (
      <div>
        <SyntaxHighlighter className="box code-block" language={language} customStyle={{ backgroundColor: 'white' }}>
          { value }
        </SyntaxHighlighter>
      </div>
    );
  }
}
