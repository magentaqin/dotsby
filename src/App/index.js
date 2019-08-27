import React from 'react';
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { Layout, Menu, Icon } from 'antd';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

require('./index.less');

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
      <div className="app-wrapper">
        <Layout style={{ minHeight: '100vh' }}>
          <Sider width={320} theme="light">
            <h1 className="docs-title">Fix Simulator Api Docs</h1>
            <Menu theme="light" defaultSelectedKeys={['1']} mode="inline">
              <Menu.Item key="1">
                <span>
                  <Icon type="read" />
                  <span>Navigation One</span>
                </span>
               </Menu.Item>
              <SubMenu
                key="sub1"
                title={
                  <span>
                    <Icon type="read" />
                   <span>Navigation Two</span>
                   </span>
                 }
               >
                <Menu.Item key="3">Tom</Menu.Item>
                <Menu.Item key="4">Bill</Menu.Item>
                <Menu.Item key="5">Alex</Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout>
            <Header style={{ background: '#fff', padding: 0 }} />
            <Content style={{ margin: '0 16px' }}>
              <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
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
                              <li dangerouslySetInnerHTML={{ __html: file.content }}></li>
                            </ul>
                          ))}
                        </div>
                      )
                    }
                  }
                </Query>
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Fix Simulator Api Docs</Footer>
          </Layout>
        </Layout>
      </div>
    )
  }
}

export default App;