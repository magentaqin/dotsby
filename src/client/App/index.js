/* eslint-disable prefer-destructuring */
/* eslint-disable react/prop-types */
/* eslint-disable import/named */
/* eslint-disable no-unused-vars */
import React from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { bindActionCreators } from 'redux';
import {
  withRouter, NavLink, Switch, Route, Redirect,
} from 'react-router-dom'
import { connect } from 'react-redux'
import reset from 'styled-reset'
import qs from 'qs'

import theme from '@src/theme/light'
import { getDocumentInfo, queryKeyword } from '@src/service/request'
import { setDocumentInfo } from '@src/store/reducerActions/document'
import { setSectionsInfo } from '@src/store/reducerActions/sections'
import { docRegx, pageRegx } from '@src/utils/regx';
import SpinSrc from '@src/client/assets/spin.svg';
import SearchIconSrc from '@src/client/assets/search.svg';
import BigArrowSrc from '@src/client/assets/big-arrow.svg';
import BigArrowActiveSrc from '@src/client/assets/big-arrow-active.svg';
import debounce from '@src/utils/debounce';

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
  display: flex;
`;

const Aside = styled.aside`
  min-width: 305px;
  border-right: 1px solid ${props => props.theme.dividerColor};
  height: 100vh;
  overflow-y: auto;
  position: sticky;
  top: 0;
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
  a {
    text-decoration: none;
    &:hover {
      opacity: 0.8;
      background-color: opacity;
    }
  }
  .active-nav-link {
    color: ${props => props.theme.primaryColor};
    text-decoration: none;
    font-weight: bold;

    h6 {
      color: ${props => props.theme.primaryColor};
    }
  }
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
  color: ${props => (props.active ? props.theme.primaryColor : props.theme.blackColor)};
`

const AsideNav = styled.ul`
  margin-left: 0;
  list-style: none;
  display: ${props => (props.shouldShow ? 'inherit' : 'none')};
`

const AsideItem = styled.li`
  font-size: ${props => props.theme.normalFont};
  margin-bottom: 0.725rem;
  color: ${props => props.theme.grayColor};
`

const Main = styled.main`
  flex-grow: 1;
  max-width: 1200px;
`

const MainHeader = styled.header`
  height: 64px;
  display: flex;
  position: sticky;
  align-items: center;
  top: 0;
  background-color: ${props => (props.isFocus ? 'initial' : props.theme.whiteColor)};
  z-index: 99;
`

const InputWrapper = styled.div`
  margin-left: 40px;
  flex-grow: 1;
  margin-top: 20px;
  position: relative;
`

const Input = styled.input`
  height: 40px;
  padding: 0;
  padding-left: 45px;
  border: 1px solid #959DAA;
  border-radius: 5px;
  box-shadow: none;
  font-size: 16px;
  outline: none;
  -webkit-appearance: none;
  width: 480px;
`

const SearchIcon = styled.img`
  width: 30px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 8px;
`

const ModalWrapper = styled.div`
  position: ${props => (props.isFocus ? 'fixed' : 'relative')};
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(90,98,112,0.5);
  z-index: 1;
`

const SearchListWrapper = styled.div`
  width: 527px;
  background-color: #fff;
  position: fixed;
  border-radius: 5px;
  top: 75px;
  visibility: ${props => (props.shouldShow ? 'visible' : 'hidden')};
`

const PageLoading = styled.div`
  position: absolute;
  right: 8px;
  visibility: ${props => (props.isPageLoading ? 'visibile' : 'hidden')};
`

const Spin = styled.img`
  width: 40px;
`

const BigArrow = styled.img`
  transform: ${props => (props.isUpper ? 'rotate(180deg)' : '')};
  display: ${props => (props.shouldShow ? 'inherit' : 'none')};
`

const SearchSection = styled.a`
  display: block;
  border-bottom: 1px solid #ddd;

  &:hover {
    cursor: pointer;
  }
  .section-top {
    background-color: ${props => props.theme.blackColor};
    padding: 4px 8px;
    p {
      font-size: ${props => props.theme.textFont};
      color: #fff;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
  }

  .section-bottom {
    padding: 8px;
    display: flex;
    font-size: ${props => props.theme.normalFont};
    line-height: ${props => props.theme.normalFont};
    color: ${props => props.theme.blackColor};

    .page-title {
      padding-right: 16px;
      border-right: 1px solid #ddd;
      min-width: 90px;
      p {
        color: ${props => props.theme.grayColor};
      }
    }

    .main-content {
      padding-left: 16px;
      p {
        font-weight: bold;
      }

      .main-bottom {
        margin-top: 8px;
        p {
          font-weight: 300;
        }
      }
    }
  }
`

const NotFoundWrapper = styled.div`
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const MatchedString = styled.code`
  font-size: ${props => props.theme.normalFont};
  color: ${props => props.theme.pinkColor};
  background-color: ${props => props.theme.lightGrayColor};
  padding: 0 2px;
`

class Layout extends React.Component {
  documentId = '';

  version = '';

  token = '';

  constructor(props) {
    super(props);
    this.state = {
      isPageLoading: false,
      isInputFocus: false,
      shouldListShow: false,
      data: [],
      value: '',
      unfoldedSections: [],
    }
    const { pathname, search } = this.props.location;
    const fullPath = pathname + search;
    this.isValidPath = docRegx.test(fullPath);
    if (this.isValidPath) {
      this.documentId = pageRegx.test(fullPath) ? fullPath.split('/')[1] : fullPath.split('?')[0].slice(1);
    }
    this.delaySearch = debounce(this.querySearchList, 500);
    const parsedSearch = qs.parse(search, { ignoreQueryPrefix: true });
    this.version = parsedSearch.version;
    this.token = parsedSearch.token;
  }

  componentDidMount() {
    if (this.isValidPath) {
      if (!this.props.document.id) {
        this.fetchDocumentInfo()
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { pathname } = this.props.location;
    const pageId = pathname.split('/')[3];
    if (!this.props.pages[pageId] && !this.state.isPageLoading) {
      this.setState({ isPageLoading: true })
    }
    if (this.props.pages[pageId] && this.state.isPageLoading) {
      this.setState({ isPageLoading: false })
      if (window.location.hash) {
        const id = window.location.hash.slice(1);
        document.getElementById(id) && document.getElementById(id).scrollIntoView();
      }
    }
    if (!prevProps.sections.length && this.props.sections.length) {
      let activeSectionId = '';
      this.props.sections.some(section => {
        const isSectionActive = section.pagesInfo.some(page => {
          if (page.page_id === pageId) {
            return true;
          }
        });
        if (isSectionActive) {
          activeSectionId = section.section_id
          return true;
        }
        return false;
      })
      this.setState({ unfoldedSections: [...this.state.unfoldedSections, activeSectionId]})
    }
  }

  fetchDocumentInfo = () => {
    getDocumentInfo({
      document_id: this.documentId,
      version: this.version,
      token: this.token,
    }).then(resp => {
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

  onInputChange = (e) => {
    this.setState({ value: e.target.value })
    this.delaySearch()
  }

  querySearchList = () => {
    const { value } = this.state;
    const data = {
      query_type: 'TEXT',
      search_string: value,
      limit: 5,
      document_id: this.documentId,
      version: this.version,
    }
    if (value.length) {
      queryKeyword(data).then(resp => {
        this.setState({
          shouldListShow: true,
          data: resp.data.data.items,
        })
      }).catch(err => {
        this.setState({
          shouldListShow: true,
        })
      })
    } else {
      this.setState({data: []})
    }
  }

  renderPages = (pages) => {
    return pages.map(item => {
      const path = `/${this.documentId}/page/${item.page_id}${this.props.location.search}`
      return (
        <AsideItem key={item.page_id}>
          <NavLink to={path} activeClassName="active-nav-link">{item.title}</NavLink>
        </AsideItem>
      )
    })
  }

  toggleAsideSection = (id) => {
    const { unfoldedSections } = this.state;
    if (unfoldedSections.includes(id)) {
      const index = unfoldedSections.indexOf(id)
      unfoldedSections.splice(index, 1)
      this.setState({
        unfoldedSections,
      })
    } else {
      this.setState({
        unfoldedSections: [...unfoldedSections, id],
      })
    }
  }

  renderSections = () => {
    return this.props.sections.map(item => {
      let rootPage;
      let path;
      const pages = item.pagesInfo.filter(item => {
        if (item.is_root_path) {
          rootPage = item;
          path = `/${this.documentId}/page/${rootPage.page_id}${this.props.location.search}`;
        }
        return !item.is_root_path
      })

      // check if current section is active
      const { pathname } = this.props.location;
      const pageId = pathname.split('/')[3];
      const isMatched = item.pagesInfo.some(item => item.page_id === pageId)

      const shouldShow = this.state.unfoldedSections.includes(item.section_id);

      return (
        <AsideSection key={item.section_id}>
          <CollapseButton onClick={() => this.toggleAsideSection(item.section_id)} >
            {rootPage ? (
              <NavLink to={path} activeClassName="active-nav-link">
                <AsideSubtitle active={isMatched}>{item.title}</AsideSubtitle>
              </NavLink>
            ) : (
              <AsideSubtitle active={isMatched}>{item.title}</AsideSubtitle>
            )
            }
            <BigArrow src={BigArrowSrc} shouldShow={!isMatched} isUpper={!shouldShow}/>
            <BigArrow src={BigArrowActiveSrc} shouldShow={isMatched} isUpper={!shouldShow} />
          </CollapseButton>
          <AsideNav shouldShow={shouldShow}>{this.renderPages(pages)}</AsideNav>
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

  onInputFocus = () => {
    this.setState({ isInputFocus: true })
  }

  onSearchBlur = () => {
    this.setState({ isInputFocus: false, value: '', shouldListShow: false })
  }

  navToMatchedPage = (path) => {
    this.setState({
      data: [],
      isInputFocus: false,
      shouldListShow: false,
      value: '',
    })
    window.location.replace(path)
  }

  renderStyledItem = (displayText, search_string) => {
    const regx = new RegExp(search_string, 'i')
    const matchResult = displayText.match(regx)
    if (matchResult && matchResult.length) {
      const splitAnchors = displayText.split(matchResult[0])
      return (
        <p>
          {splitAnchors[0]}
          <MatchedString>{matchResult[0]}</MatchedString>
          {splitAnchors[1]}
        </p>
      )
    }
    return <p>{displayText}</p>
  }

  renderSearchList = () => {
    if (!this.state.data.length) {
      return (
        <NotFoundWrapper>
          <h3>No Results Found.</h3>
        </NotFoundWrapper>
      )
    }
    return this.state.data.map((item, index) => {
      const key = item.section_id + item.page_id + index;
      const displayAnchor = item.anchor || item.page_title;
      let path = `/${this.documentId}/page/${item.page_id}${this.props.location.search}`;
      if (item.anchor) {
        const anchor = item.anchor.toLowerCase().split(' ').join('-');
        path += `#${anchor}`
      }
      return (
        <SearchSection onClick={() => this.navToMatchedPage(path)} key={key}>
          <div>
            <div className="section-top"><p>{item.section_title}</p></div>
            <div className="section-bottom">
              <div className="page-title"><p>{item.page_title}</p></div>
              <div className="main-content">
                {this.renderStyledItem(displayAnchor, item.search_string)}
                {item.content ? (
                  <div className="main-bottom">
                    {this.renderStyledItem(item.content, item.search_string)}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </SearchSection>
      )
    })
  }

  renderMainHeader = () => (
    <MainHeader isFocus={this.state.isInputFocus}>
      <InputWrapper>
        <Input
          value={this.state.value}
          onChange={this.onInputChange}
          onFocus={this.onInputFocus}
          placeholder="Search Docs"
        />
        <SearchIcon src={SearchIconSrc}/>
        <SearchListWrapper shouldShow={this.state.shouldListShow}>
          {this.renderSearchList()}
        </SearchListWrapper>
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
          <ModalWrapper isFocus={this.state.isInputFocus} onClick={this.onSearchBlur}/>
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
