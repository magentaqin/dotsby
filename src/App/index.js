import React from 'react';
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { Layout, Menu, Icon, Input } from 'antd';

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
          <Sider width={250} theme="light" style={{ borderRight: '1px solid #ddd' }}>
            <div style={{ padding: '16px 0 16px 24px', borderBottom: '1px solid #ddd'}}>
              <h1 className="docs-title">Fix Simulator Api Docs</h1>
            </div>
            <Menu theme="light" defaultSelectedKeys={['1']} mode="inline" style={{ borderRight: 0}}>
              <Menu.Item key="1">
                <span>
                  <Icon type="read" />
                  <span>Overview</span>
                </span>
               </Menu.Item>
              <SubMenu
                key="sub1"
                title={
                  <span>
                    <Icon type="read" />
                   <span>Lua Api</span>
                   </span>
                 }
               >
                <Menu.Item key="3">Tom</Menu.Item>
                <Menu.Item key="4">Bill</Menu.Item>
                <Menu.Item key="5">Alex</Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ background: '#fff'}}>
            <Header style={{ background: '#fff', padding: 0, padding: '16px 0 16px 48px', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center'}}>
              <Input style={{ width: '480px', height: '40px'}} placeholder="Search Docs" />
            </Header>
            <Content style={{ margin: '0 16px', position: 'relative', maxWidth: 1200 }}>
              <div style={{ padding: 24, background: '#fff', minHeight: 360, maxWidth: 800 }}>
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
              <ul style={{ position: 'absolute', top: 150, width: '100px', height: '200px', backgroundColor: 'red', right: 0}}>
                <li>
                  <span>
                    <span>Overview</span>
                  </span>
                </li>
              </ul>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Fix Simulator Api Docs</Footer>
          </Layout>
        </Layout>
      </div>
    )
  }
}

export default App;