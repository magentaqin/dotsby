import React from 'react';
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

class App extends React.Component {
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
            if (loading) return <div>Fetching</div>
            if (error) return <div>Error</div>

            const files = data.allFile.files;
            return (
              <div>
                {files.map(file => (
                  <ul key={file.id}>
                    <li>{file.id}</li>
                    <li dangerouslySetInnerHTML={{ __html: file.content }}></li>
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