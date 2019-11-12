/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getPageInfo } from '../server/request';
import { setPagesInfo } from '../store/reducerActions/pages';

class MainContent extends React.Component {
  componentDidMount() {
    // const info = {}
    // getPageInfo({ id: this.pageId }).then(resp => {
    //   const { page_id } = resp.data.data
    //   info[page_id] = resp.data.data
    //   this.props.setPagesInfo(info)
    // }).catch(err => err)
  }

  get pageId() {
    const { pathname } = this.props.location
    const pageId = this.props.routeIdMap[pathname]
    return pageId;
  }

  render() {
    // if (!Object.keys(this.props.pages).length) {
    //   return null;
    // }
    // const { content } = this.props.pages[this.pageId]
    const content = '<h1>Hello World</h1>'
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
