/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';


class MainContent extends React.Component {
  render() {
    return (
      <div>
        <div dangerouslySetInnerHTML={{ __html: '<h1>HELLO WORLD</h1>' }}></div>
      </div>
    )
  }
}

const mapStateToProps = (store) => ({

})

export default connect(mapStateToProps, null)(MainContent);
