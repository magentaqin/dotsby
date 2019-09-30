import React from 'react';
import { connect } from 'react-redux';


class MainContent extends React.Component {
  render() {
    return (
      <div>
        {this.props.files.map(file => (
          <ul key={file.id}>
            <li dangerouslySetInnerHTML={{ __html: file.content }}></li>
          </ul>
        ))}
      </div>
    )
  }
}

const mapStateToProps = (store) => {
  return {
    files: store.fileReducer.files,
  }
}

export default connect(mapStateToProps, null)(MainContent);