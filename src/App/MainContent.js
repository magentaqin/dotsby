/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getPageInfo } from '../server/request';
import { setPagesInfo } from '../store/reducerActions/pages';

class MainContent extends React.Component {
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

  render() {
    if (!this.props.pages[this.pageId]) {
      return <h1>loading</h1>
    }
    const { content } = this.props.pages[this.pageId]
    return (
      <div>
        <div dangerouslySetInnerHTML={{ __html: `${content}` }}></div>
      </div>
    )
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
