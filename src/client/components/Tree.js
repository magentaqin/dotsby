import React from 'react';
import styled from 'styled-components';
import TreeNode from './TreeNode';

const Wrapper = styled.div`
  border: 1px solid ${props => props.theme.dividerColor};
`

export default class Tree extends React.Component {
  state = {
    expandedIds: ['0'],
  }

  toggleExpand = (id) => {
    let expandedIds = []
    if (this.state.expandedIds.includes(id)) {
      expandedIds = this.state.expandedIds.filter(item => item !== id)
    } else {
      expandedIds = [...this.state.expandedIds]
      expandedIds.push(id)
    }
    this.setState({ expandedIds })
  }

  getTreeChildrenData = (properties, baseKey) => {
    return properties.map((item, index) => {
      const key = `${baseKey}-${index}`;
      let children = null;
      const data = { ...item }

      if ((item.properties && item.properties.length)) {
        children = this.getTreeChildrenData(item.properties, key);
      }

      const hasJsonSchema = item.type.includes('type')
      if (hasJsonSchema) {
        const schemaItem = JSON.parse(item.type);
        data.type = schemaItem.type;
        const schemaProperties = []
        Object.keys(schemaItem.properties).forEach(prop => {
          schemaProperties.push({
            type: schemaItem.properties[prop].type,
            description: schemaItem.properties[prop].description,
            displayName: prop,
            key: prop,
            required: schemaItem.required.includes(prop),
          })
        })
        children = this.getTreeChildrenData(schemaProperties, key)
      }
      return {
        id: key,
        data,
        childrenData: children,
      }
    })
  }

  renderChildren = (childrenData) => {
    if (!childrenData) return null;
    return childrenData.map(item => {
      return (
        <TreeNode
          key={item.id}
          id={item.id}
          parentId={this.getParentId(item.id)}
          data={item.data}
          toggleExpand={this.toggleExpand}
          expandedIds={this.state.expandedIds}
        >
          {this.renderChildren(item.childrenData)}
        </TreeNode>
      )
    })
  }

  getParentId = (id) => {
    const arr = id.split('-')
    arr.pop()
    return arr.join('-');
  }

  renderTree() {
    return this.props.data.map((outerNode, outerIndex) => {
      let childrenData = null;
      const id = `0-${outerIndex}`;
      if (outerNode.properties && outerNode.properties.length) {
        childrenData = this.getTreeChildrenData(outerNode.properties, id)
      }
      return (
        <TreeNode
          key={id}
          id={id}
          parentId={this.getParentId(id)}
          data={outerNode}
          toggleExpand={this.toggleExpand}
          expandedIds={this.state.expandedIds}
        >
          {this.renderChildren(childrenData)}
        </TreeNode>
      )
    })
  }

  render() {
    return (
      <Wrapper>
        {this.renderTree()}
      </Wrapper>
    )
  }
}
