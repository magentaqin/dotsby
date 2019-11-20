/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getPageInfo } from '../server/request';
import { setPagesInfo } from '../store/reducerActions/pages';
import Table from '../components/Table';

const { Fragment } = React;

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
        <li>
          <h6>Request Headers</h6>
          <Table tConfig={this.tConfig} tData={headers} />
        </li>
      )
    }
    return null;
  }

  renderRequestData = (apiContent) => {
    return (
      <div>
        <h3>Request Definitions</h3>
        <ul>
          <li>
            <h6>Request URL</h6>
            <p>{apiContent.request_url}</p>
          </li>
          <li>
            <h6>Request Method</h6>
            <p>{apiContent.method}</p>
          </li>
          {this.renderRequestHeaders(apiContent.request_headers)}
        </ul>
      </div>
    )
  }

  renderApiContent = (apiContent) => {
    return (
      <div>
        <h1>{apiContent.title}</h1>
        {this.renderRequestData(apiContent)}
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
