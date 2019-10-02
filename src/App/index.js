import React from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { bindActionCreators } from 'redux';
import { withRouter, Link, Switch, Route, Redirect } from "react-router-dom"
import { connect } from 'react-redux'
import reset from 'styled-reset'
import theme from '../theme/light'

import ArrowDown from './ArrowDown';
import MainContent from './MainContent';
// import Welcome from './Welcome';
import { httpRequest } from './request';
import { setFiles } from '../store/actions';

export const query = `
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

const GlobalStyle = createGlobalStyle`
  ${reset}
  body {
    font-family: 'Source Sans Pro,sans-serif';
  }
`

const AppWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  display: flex;
`;

const Aside = styled.aside`
  width: 305px;
  border-right: 1px solid ${props => props.theme.dividerColor};
  height: 100vh;
  overflow-y: auto;
`;

const AsideHeader = styled.header`
  padding: 0 ${props => props.theme.mdPadding};
  border-bottom: 1px solid ${props => props.theme.dividerColor};
  display: flex;
  alignItems: center;
  height: 64px;
`

const H1 = styled.h1`
  font-size: ${props => props.theme.headerFont};
  line-height: 64px;
  color: ${props => props.theme.primaryColor};
`

const AsideContent = styled.div`
  padding: 0 0 ${props => props.theme.mdPadding} ${props => props.theme.mdPadding};
`

const AsideSection = styled.div`
  ${'' /* border-bottom: 1px solid ${props => props.theme.dividerColor}; */}
`;

const CollapseButton = styled.button`
  width: 100%;
  outline: none;
  color: ${props => props.theme.grayColor};
  border: 0;
  padding: ${props => props.theme.smPadding};
  padding-left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;

  &:hover {
    cursor: pointer;
  }
`;

const AsideSubtitle = styled.h6`
  font-size: ${props => props.theme.normalFont};
  line-height: ${props => props.theme.normalFont};
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 500;
`

const AsideNav = styled.ul`
  margin-left: 0;
  list-style: none;
`

const AsideItem = styled.li`
  font-size: ${props => props.theme.normalFont};
  margin-bottom: 0.725rem;
  color: ${props => props.theme.grayColor};
`

const Main = styled.main`
  overflow-y: auto;
  flex-grow: 1;
`

const MainHeader = styled.header`
  height: 64px;
  padding: 0 24px;
  display: flex;
  position: sticky;
  align-items: center;
  top: 0;
`

const InputWrapper = styled.div`
  margin-left: 40px;
  max-width: 480px;
  flex-grow: 1;
`

const Input = styled.input`
  width: 100%;
  height: 40px;
  padding: 0;
  padding-left: 16px;
  border: 1px solid #959DAA;
  border-radius: 5px;
  box-shadow: none;
  font-size: 14px;
  background: white;
  outline: none;
  -webkit-appearance: none;
`

class Layout extends React.Component {

  componentDidMount() {
    if (!this.props.files.length) {
      httpRequest.post('/', { query }).then(resp => {
        this.props.setFiles(resp.data.data.allFile.files)
      })
    }
  }

  renderItems = () => {
    // TODO: mock
    const arr = this.props.files.map(item => {
      return {
        id: item.id,
        name: item.id,
      }
    })
    return arr.map(item => (
      <AsideItem key={item.id}>
        <Link to={item.id}>{item.id}</Link>
      </AsideItem>
    ))
  }

  renderAside = () => {
    return (
      <Aside>
        <AsideHeader>
          <H1>Fix Simulator Api Docs</H1>
        </AsideHeader>
        <AsideContent>
          <AsideSection>
            <CollapseButton>
              <AsideSubtitle>Essentials</AsideSubtitle>
              <ArrowDown />
            </CollapseButton>
            <AsideNav>
              {this.renderItems()}
            </AsideNav>
          </AsideSection>
        </AsideContent>
      </Aside>
    )
  }

  renderMainHeader = () => {
    return (
      <MainHeader>
        <InputWrapper>
          <Input />
        </InputWrapper>
      </MainHeader>
    )
  }


  renderMain = () => {
    const defaultId = this.props.files[0].id;
    console.log('prop.location.pathname',this.props.location)
    return (
      <Main>
        {this.renderMainHeader()}
        <Switch>
          <Route path="/:id" component={MainContent} />
          <Redirect to={defaultId} />
        </Switch>
      </Main>
    )
  }

  render() {
    if (!this.props.files.length) {
      return <h1>loading</h1>;
    }
    return (
      <ThemeProvider theme={theme}>
        <AppWrapper>
          {this.renderAside()}
          {this.renderMain()}
        </AppWrapper>
      </ThemeProvider>
    )
  }
}

const mapStateToProps = (store) => {
  return {
    files: store.fileReducer.files,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setFiles: setFiles,
  }, dispatch)
}

const LayoutWithRouter = withRouter(Layout);

const ConnectedLayout = connect(mapStateToProps, mapDispatchToProps)(LayoutWithRouter);

const App = () => (
  <React.Fragment>
    <ConnectedLayout />
    <GlobalStyle />
  </React.Fragment>
)


export default App;