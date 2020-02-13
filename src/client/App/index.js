/* eslint-disable prefer-destructuring */
/* eslint-disable react/prop-types */
/* eslint-disable import/named */
/* eslint-disable no-unused-vars */
import React from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { bindActionCreators } from 'redux';
import {
  withRouter, Link, Switch, Route, Redirect,
} from 'react-router-dom'
import { connect } from 'react-redux'
import reset from 'styled-reset'
import qs from 'qs'

import theme from '@src/theme/light'
import { BigArrow } from '@src/client/components/Arrow';
import { getDocumentInfo } from '@src/service/request'
import { setDocumentInfo } from '@src/store/reducerActions/document'
import { setSectionsInfo } from '@src/store/reducerActions/sections'
import { docRegx, pageRegx } from '@src/utils/regx';
import SpinSrc from '@src/client/assets/spin.svg';
import MainContent from './MainContent';

const GlobalStyle = createGlobalStyle`
  ${reset}
  body {
    font-family: "Source Sans Pro", sans-serif;
  }

  a:link,
  a:visited,
  a:hover,
  a:active {
    text-decoration: none;
    color: #2f353f;
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
  text-align: left;
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
  max-width: 1200px;
`

const MainHeader = styled.header`
  height: 64px;
  display: flex;
  position: sticky;
  align-items: center;
  top: 0;
  background-color: ${props => props.theme.whiteColor};
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

const PageLoading = styled.div`
  position: absolute;
  right: 8px;
  visibility: ${props => (props.isPageLoading ? 'visibile' : 'hidden')};
`

const Spin = styled.img`
  width: 40px;
`


class Layout extends React.Component {
  documentId = '';

  constructor(props) {
    super(props);
    this.state = {
      isPageLoading: false,
    }
    const { pathname, search } = this.props.location;
    const fullPath = pathname + search;
    this.isValidPath = docRegx.test(fullPath);
    if (this.isValidPath) {
      this.documentId = pageRegx.test(fullPath) ? fullPath.split('/')[1] : fullPath.split('?')[0].slice(1);
    }
  }

  componentDidMount() {
    if (this.isValidPath) {
      if (!this.props.document.id) {
        this.fetchDocumentInfo()
      }
    }
  }

  componentDidUpdate() {
    const { pathname } = this.props.location;
    const pageId = pathname.split('/')[3];
    if (!this.props.pages[pageId] && !this.state.isPageLoading) {
      this.setState({ isPageLoading: true })
    }
    if (this.props.pages[pageId] && this.state.isPageLoading) {
      this.setState({ isPageLoading: false })
    }
  }

  fetchDocumentInfo = () => {
    const { search } = this.props.location;
    const { version, token } = qs.parse(search, { ignoreQueryPrefix: true });
    getDocumentInfo({ document_id: this.documentId, version, token }).then(resp => {
      const { data } = resp.data;
      const { document_id, sections, ...rest } = data
      const sectionIds = []
      const sectionMap = {}

      // set sections info
      sections.forEach(section => {
        const { section_id, title, pages } = section;
        const pagesInfo = []
        pages.forEach(page => {
          pagesInfo.push(page)
        })
        sectionIds.push(section_id)
        sectionMap[section_id] = {
          section_id,
          title,
          pagesInfo,
        }
      })

      this.props.setSectionsInfo(sectionMap)

      // set document info
      const documentInfo = {
        ...rest,
        id: document_id,
        sectionIds,
      }
      this.props.setDocumentInfo(documentInfo)
    }).catch(err => console.log(err))
  }

  renderPages = (pages) => {
    return pages.map(item => {
      const path = `/${this.documentId}/page/${item.page_id}${this.props.location.search}`
      return (
        <AsideItem key={item.page_id}>
          <Link to={path}>{item.title}</Link>
        </AsideItem>
      )
    })
  }

  renderSections = () => {
    return this.props.sections.map(item => {
      return (
        <AsideSection key={item.section_id}>
          <CollapseButton>
            <AsideSubtitle>{item.title}</AsideSubtitle>
            <BigArrow />
          </CollapseButton>
          <AsideNav>{this.renderPages(item.pagesInfo)}</AsideNav>
        </AsideSection>
      )
    })
  }

  renderAside = () => (
    <Aside>
      <AsideHeader>
        <H1>{this.props.documentTitle}</H1>
      </AsideHeader>
      <AsideContent>
        {this.renderSections()}
      </AsideContent>
    </Aside>
  )

  renderMainHeader = () => (
    <MainHeader>
      <InputWrapper>
        <Input />
      </InputWrapper>
      <PageLoading isPageLoading={this.state.isPageLoading}>
        <Spin src={SpinSrc} />
      </PageLoading>
    </MainHeader>
  )


  renderMain = () => {
    const { search } = this.props.location;
    const pageId = this.props.sections[0].pagesInfo[0].page_id;
    const defaultPath = `/${this.documentId}/page/${pageId}${search}`;
    return (
      <Main>
        {this.renderMainHeader()}
        <Switch>
          <Route path="/:documentId/page/:pageId" component={MainContent} />
          <Redirect to={defaultPath} />
        </Switch>
      </Main>
    )
  }

  render() {
    if (!this.isValidPath) {
      if (this.props.location.pathname === '/') {
        return <h1>Welcome to Dotsby Api Docs Generator.</h1>
      }
      return <h1>Oops...Page Not Found.</h1>
    }
    if (!this.props.sections.length) {
      return <h1>Oops...Page Not Found.</h1>;
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

const mapStateToProps = (store) => ({
  document: store.documentReducer.document,
  documentTitle: store.documentReducer.document.title,
  sections: Object.values(store.sectionsReducer.sections),
  pages: store.pagesReducer.pages,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setDocumentInfo,
  setSectionsInfo,
}, dispatch)

const LayoutWithRouter = withRouter(Layout);

const ConnectedLayout = connect(mapStateToProps, mapDispatchToProps)(LayoutWithRouter);

const App = () => (
  <React.Fragment>
    <ConnectedLayout />
    <GlobalStyle />
  </React.Fragment>
)


export default App;
