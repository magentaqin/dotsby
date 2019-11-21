/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

import { getPageInfo } from '../server/request';
import { setPagesInfo } from '../store/reducerActions/pages';
import Table from '../components/Table';
import Divider from '../components/Divider';

const { Fragment } = React;

const CoreContent = styled.div`
  max-width: 800px;
`

const H1 = styled.h1`
  font-size: ${props => props.theme.mainHeaderFont};
  color: ${props => props.theme.blackColor};
  font-weight: bolder;
  margin-bottom: 16px;
  margin-top: 40px;
`

const H2 = styled.h1`
  font-size: ${props => props.theme.mainSubtitleFont};
  color: ${props => props.theme.blackColor};
  font-weight: bold;
  margin-top: 40px;
`

const H6 = styled.h1`
  font-size: ${props => props.theme.normalFont};
  color: ${props => props.theme.grayColor};
  font-weight: bold;
  line-height: 40px;
`

const Li = styled.li`
  margin-top: 24px;
`

const HighlightText = styled.code`
  font-size: ${props => props.theme.textFont};
  color: ${props => props.theme.pinkColor};
  background-color: ${props => props.theme.lightGrayColor};
  padding: 4px;
  border-radius: 4px;
`

class MainContent extends React.Component {
  tConfig = [
    { label: 'Key', value: 'key' },
    { label: 'Type', value: 'type' },
    { label: 'Required', value: 'required', render: (required) => (required ? 'Required' : 'Optional') },
    { label: 'Description', value: 'description' },
  ]

  componentDidMount() {
    const info = {}
    if (!this.props.pages[this.pageId]) {
      getPageInfo({ id: this.pageId }).then(resp => {
        const { page_id } = resp.data.data
        info[page_id] = resp.data.data
        this.props.setPagesInfo(info)
      }).catch(err => err)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      const info = {}
      getPageInfo({ id: this.pageId }).then(resp => {
        const { page_id } = resp.data.data
        info[page_id] = resp.data.data
        this.props.setPagesInfo(info)
      }).catch(err => err)
    }
  }

  get pageId() {
    const { pathname } = this.props.location
    const pageId = this.props.routeIdMap[pathname]
    return pageId;
  }

  renderRequestHeaders = (headers) => {
    if (headers && headers.length) {
      return (
        <Li>
          <H6>Request Headers</H6>
          <Table tConfig={this.tConfig} tData={headers} />
        </Li>
      )
    }
    return null;
  }

  renderRequestData = (apiContent) => {
    return (
      <div>
        <H2>Request Definitions</H2>
        <ul>
          <Li>
            <H6>Request URL</H6>
            <HighlightText>{apiContent.request_url}</HighlightText>
          </Li>
          <Li>
            <H6>Request Method</H6>
            <HighlightText>{apiContent.method}</HighlightText>
          </Li>
          {this.renderRequestHeaders(apiContent.request_headers)}
        </ul>
      </div>
    )
  }

  renderApiContent = (apiContent) => {
    return (
      <div>
        <H1>{apiContent.title}</H1>
        <Divider />
        <CoreContent>
          {this.renderRequestData(apiContent)}
        </CoreContent>
      </div>
    )
  }

  render() {
    if (!this.props.pages[this.pageId]) {
      return <h1>Content Not Available.</h1>
    }
    const { content, apiContent } = this.props.pages[this.pageId]
    if (content) {
      return (
        <div>
          <div dangerouslySetInnerHTML={{ __html: `${content}` }}></div>
        </div>
      )
    }

    if (apiContent) {
      return (
        <div>
          {this.renderApiContent(apiContent)}
        </div>
      )
    }
  }
}

const mapStateToProps = (store) => {
  const sections = Object.values(store.sectionsReducer.sections)
  const routeIdMap = {}
  sections.forEach(section => {
    section.pagesInfo.forEach(item => {
      routeIdMap[item.path] = item.page_id
    })
  })
  return {
    routeIdMap,
    pages: store.pagesReducer.pages,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setPagesInfo,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MainContent);
