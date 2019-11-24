import React from 'react';
import styled from 'styled-components';
import { SmallArrow } from './Arrow';

const Wrapper = styled.div`
  border: 1px solid ${props => props.theme.dividerColor};
`

const PanelItem = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  background-color: ${props => (props.count % 2 === 0 ? props.theme.whiteColor : 'red')};
  width: 100%;
`

const LeftItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  padding-left: ${props => props.nestedLevel * 16 + 32}px;
  flex: 1;
`
const RightItem = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 8px 0;
`

const CollapsePanel = ({ data }) => {
  let count = 0;
  let nestedLevel = 0;
  let prevIndex = -1;

  const renderPanel = (data) => {
    return data.map((item, index) => {
      console.log(item)
      let {
        displayName,
        type,
        description,
        required,
        example,
        properties,
      } = item
      const enumText = item.enum;
      const hasJsonSchema = type.includes('type')
      if (hasJsonSchema) {
        const schemaItem = JSON.parse(item.type);
        type = schemaItem.type;
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
        properties = schemaProperties
      }

      // total row count
      count += 1;

      if (prevIndex !== index) {
        nestedLevel = 0;
        prevIndex = index;
      } else {
        nestedLevel += 1;
      }

      const isNested = properties && properties.length;

      return (
        <PanelItem key={index} count={count}>
          <LeftItem nestedLevel={nestedLevel}>
            <div>
              {isNested ? <SmallArrow /> : null }
              <span>{displayName}</span>
              <span>{type}</span>
            </div>
            <span>{description}</span>
          </LeftItem>
          <RightItem>
            <span>{required ? 'Required' : 'Optional'}</span>
            <span>{enumText}</span>
            <span>{example}</span>
          </RightItem>
          {isNested ? renderPanel(properties) : null }
        </PanelItem>
      )
    })
  }
  return (
    <Wrapper>
      {renderPanel(data)}
    </Wrapper>
  )
}

export default CollapsePanel;
