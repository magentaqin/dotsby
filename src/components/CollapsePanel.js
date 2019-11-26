import React from 'react';
import styled from 'styled-components';
import { SmallArrow } from './Arrow';

const Wrapper = styled.div`
  border: 1px solid ${props => props.theme.dividerColor};
`

const PanelWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
   &:hover {
    background-color: ${props => props.theme.panelItemHoverColor};
    cursor: pointer;
  }
  &:not(:hover) {
    background-color: ${props => (props.count % 2 === 0 ? props.theme.panelItemColor : props.theme.whiteColor)};
    cursor: initial;
  }
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
  align-items: flex-end;
  flex: 1;
  padding: 8px 8px 8px 0;;
`

const FlexRow = styled.div`
  display: flex;
  align-items: center;
`

const TypeText = styled.code`
  font-size: ${props => props.theme.textFont};
  color: ${props => props.theme.pinkColor};
  background-color: ${props => props.theme.lightGrayColor};
  padding: 4px;
  border-radius: 4px;
  margin-left: 8px;
`

const NoteText = styled.p`
  font-size: ${props => props.theme.textFont};
  color: ${props => props.theme.grayColor};
`

const RequiredText = styled.p`
  font-size: ${props => props.theme.textFont};
  color: ${props => props.theme.primaryColor};
  font-weight: bolder;
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
        <div key={index}>
          <PanelWrapper count={count}>
            <LeftItem nestedLevel={nestedLevel}>
              <FlexRow>
                {isNested ? <SmallArrow /> : null }
                <p>{displayName}</p>
                <TypeText>{type}</TypeText>
              </FlexRow>
              <NoteText>{description}</NoteText>
            </LeftItem>
            <RightItem>
              <RequiredText>{required ? 'Required' : 'Optional'}</RequiredText>
              <NoteText>{enumText}</NoteText>
              <NoteText>{example}</NoteText>
            </RightItem>
          </PanelWrapper>
          {isNested ? renderPanel(properties) : null }
        </div>
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
