import React, { Component } from 'react';
import remark from 'remark';
import recommended from 'remark-preset-lint-recommended';
import html from 'remark-html';

import { render } from 'react-dom';

// const recommended = require('remark-preset-lint-recommended');
// const html = require('remark-html');
// const report = require('vfile-reporter');

interface Props {}

interface State {
  __html: string;
}

class App extends Component <Props, State>{
  constructor(props: Props) {
    super(props);
    this.state = { __html: '' };
  }

  componentDidMount() {
    const self = this;
    remark()
      .use(recommended)
      .use(html)
      .process('## Hello world 123!', function(err, file) {
        if (!err) {
          console.log(file);
          self.setState({ __html: String(file) });
        } else {
          console.error(err);
        }
      })
  }

  render() {
    return (
      <div dangerouslySetInnerHTML={{ __html: this.state.__html }} />
    )
  }
}

render(<App />, document.getElementById('root'));
