import React, { Component } from 'react';
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const FILE_QUERY = gql`
  query {
    allFile {
      files {
        id
        absolutePath
        content
      }
    }
  }
`

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Hello</h1>
        <Query query={FILE_QUERY}>
        {
          ({ loading, error, data }) => {
            console.log('render')
            if (loading) return <div>Fetching</div>
            if (error) return <div>Error</div>

            const files = data.allFile.files;
            return (
              <div>
                {files.map(file => (
                  <ul>
                    <li>{file.id}</li>
                    <li>{file.absolutePath}</li>
                    <li>{file.content}</li>
                  </ul>
                ))}
              </div>
            )
          }
        }
      </Query>
      </div>
    )
  }
}

export default App;

