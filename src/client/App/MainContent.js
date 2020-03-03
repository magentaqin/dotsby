/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

import { getPageInfo } from '@src/service/request';
import { setPagesInfo } from '@src/store/reducerActions/pages';
import Table from '../components/Table';
import Divider from '../components/Divider';
import Tree from '../components/Tree';

const Wrapper = styled.div`
  padding: 20px 64px;
`

const CustomziedContent = styled.div`
  h2, h3, h4, h5,h6 {
    color: ${props => props.theme.blackColor};
    font-weight: 500;
    position: relative;

    .anchor {
      position: absolute;
      top: -80px;
    }

    .hash-link {
      position: absolute;
      left: -20px;
      width: 20px;
      color: ${props => props.theme.primaryColor};
      visibility: hidden;

      &:hover {
        visibility: visible;
      }
    }

    &:hover {
      color: ${props => props.theme.primaryColor};
      .hash-link {
        cursor: pointer;
        visibility: visible;
      }
    }
  }

  h1 {
    color: ${props => props.theme.blackColor};
    font-size: ${props => props.theme.mainHeaderFont};
    margin-bottom: ${props => props.theme.mdPadding};
    font-weight: 500;
  }

  h2 {
    margin-top: 56px;
    margin-bottom: 20px;
    font-size: ${props => props.theme.mainSubtitleFont};
  }

  p {
    font-size: ${props => props.theme.paraFont};
    color: ${props => props.theme.grayColor};
    line-height: 1.7;
  }

  li {
    list-style: initial;
    margin-bottom: ${props => props.theme.mdPadding};
  }
`

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

const HighlightTitle = styled.code`
font-size: ${props => props.theme.headerFont};
color: ${props => props.theme.pinkColor};
background-color: ${props => props.theme.lightGrayColor};
padding: 4px;
border-radius: 4px;
`

class MainContent extends React.Component {
  prevPageId = '';

  tConfig = [
    { label: 'Key', value: 'key' },
    { label: 'Type', value: 'type' },
    { label: 'Required', value: 'required', render: (required) => (required ? 'Required' : 'Optional') },
    { label: 'Description', value: 'description' },
  ]

  componentDidMount() {
    this.fetchPageInfo();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.fetchPageInfo();
    }
  }

  get pageId() {
    return this.props.match.params.pageId;
  }

  get documentId() {
    return this.props.match.params.documentId;
  }

  fetchPageInfo = () => {
    const info = {}
    getPageInfo({ document_id: this.documentId, page_id: this.pageId }).then(resp => {
      const { page_id } = resp.data.data
      this.prevPageId = page_id;
      info[page_id] = resp.data.data
      this.props.setPagesInfo(info)
    }).catch(err => {
      console.log(err);
    })
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

  renderQueryParams = (queryParams) => {
    if (queryParams && queryParams.length) {
      return (
        <Li>
          <H6>Query Params</H6>
          <Table tConfig={this.tConfig} tData={queryParams} />
        </Li>
      )
    }
    return null;
  }

  renderRequestBody = (body) => {
    if (body && body.length) {
      return (
        <Li>
          <H6>Request Body</H6>
          <Table tConfig={this.tConfig} tData={body} />
        </Li>
      )
    }
    return null;
  }

  renderRequestData = (apiContent) => {
    return (
      <div>
        <H2>Request</H2>
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
          {this.renderQueryParams(apiContent.query_params)}
          {this.renderRequestBody(apiContent.body)}
        </ul>
      </div>
    )
  }

  renderResponseBody = (data) => {
    // console.log(data)
    return (
      <Li>
        <H6>Response Body</H6>
        <Tree data={data} />
      </Li>
    );
  }

  renderResponses = (responses) => {
    return responses.map(response => {
      const { status, headers, data } = response;
      return (
        <ul key={response.key}>
          <Li>
            <HighlightTitle>{`${status} Status`}</HighlightTitle>
          </Li>
          {this.renderRequestHeaders(headers)}
          {this.renderResponseBody(data)}
        </ul>
      )
    })
  }

  renderResponseHeaders = (headers) => {
    if (headers && headers.length) {
      return (
        <Li>
          <H6>Response Headers</H6>
          <Table tConfig={this.tConfig} tData={headers} />
        </Li>
      )
    }
    return null;
  }

  renderResponseData = (apiContent) => {
    return (
      <div>
        <H2>Response</H2>
        {this.renderResponses(apiContent.responses)}
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
          {this.renderResponseData(apiContent)}
        </CoreContent>
      </div>
    )
  }

  render() {
    const prevPage = this.props.pages[this.prevPageId];
    const currentPage = this.props.pages[this.pageId];
    if (!prevPage && !currentPage) {
      return (
        <Wrapper>
          <h1>Loading...</h1>
        </Wrapper>
      )
    }
    const content = currentPage ? currentPage.content : prevPage.content;
    const api_content = currentPage ? currentPage.api_content : prevPage.api_content;
    if (content) {
      return (
        <Wrapper>
          <CustomziedContent dangerouslySetInnerHTML={{ __html: `${content}` }}></CustomziedContent>
        </Wrapper>
      )
    }

    if (api_content) {
      return (
        <Wrapper>
          {this.renderApiContent(api_content)}
        </Wrapper>
      )
    }
  }
}

const mapStateToProps = (store) => {
  return {
    pages: store.pagesReducer.pages,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setPagesInfo,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MainContent);
