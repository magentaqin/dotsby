import React from 'react';
import styled from 'styled-components';
import TreeNode from './TreeNode';

const Wrapper = styled.div`
  border: 1px solid ${props => props.theme.dividerColor};
`

export default class Tree extends React.Component {
  toggleExpand = () => {

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
          data={item.data}
        >
          {this.renderChildren(item.childrenData)}
        </TreeNode>
      )
    })
  }

  renderTree() {
    return this.props.data.map((outerNode, outerIndex) => {
      let childrenData = null;
      const key = `0-${outerIndex}`;
      if (outerNode.properties && outerNode.properties.length) {
        childrenData = this.getTreeChildrenData(outerNode.properties, key)
      }
      return (
        <TreeNode
          key={key}
          id={key}
          data={outerNode}
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
