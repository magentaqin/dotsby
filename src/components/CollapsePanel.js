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
  padding: 8px 32px 8px 0;;
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

class CollapsePanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expandedItems: [],
    }
  }

  count = 0;

  nestedLevel = 0;

  prevIndex = -1;

  checkShouldExpand(index) {
    let shouldExpand = false;
    this.state.expandedItems.forEach(item => {
      if (index === item.index && this.nestedLevel === item.nestedLevel) {
        shouldExpand = true;
      }
    })
    return shouldExpand;
  }

  toggleExpand = (index, nestedLevel) => {
    const item = { index, nestedLevel }
    console.log('EXPAND', index, nestedLevel, this.state.expandedItems)

    let shouldAdd = true;
    const filteredExpandedItems = this.state.expandedItems.filter(item => {
      const prevNestedLevel = nestedLevel - 1;
      if (item.index === index && nestedLevel > item.nestedLevel) {
        shouldAdd = false;
        return;
      }
      return item;
    })

    console.log('shouldAdd', shouldAdd)
    const expandedItems = [...this.state.expandedItems]
    expandedItems.push(item)
    this.nestedLevel = nestedLevel;
    this.prevIndex = -1;
    this.setState({ expandedItems })

    if (shouldAdd) {
      // const expandedItems = [...this.state.expandedItems]
      // expandedItems.push(item)
      // this.nestedLevel = nestedLevel;
      // this.prevIndex = -1;
      // this.setState({ expandedItems })
    } else {
      // this.prevIndex = -1;
      // this.setState({ expandedItems: filteredExpandedItems })
    }
  }

  renderPanel = (data) => {
    return data.map((item, index) => {
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
      this.count += 1;

      if (this.prevIndex !== index) {
        this.nestedLevel = 0;
        this.prevIndex = index;
      } else {
        this.nestedLevel += 1;
      }

      const isNested = (properties && properties.length) ? true : false;
      const shouldExpand = this.checkShouldExpand(index);

      console.log('RENDER', index, this.nestedLevel)

      return (
        <div key={index}>
          <PanelWrapper count={this.count}>
            <LeftItem nestedLevel={this.nestedLevel}>
              <FlexRow>
                {isNested ? <div onClick={() => this.toggleExpand(index, this.nestedLevel)}><SmallArrow /></div> : null }
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
          {isNested && shouldExpand ? this.renderPanel(properties) : null }
        </div>
      )
    })
  }

  render() {
    return (
      <Wrapper>
        {this.renderPanel(this.props.data)}
      </Wrapper>
    )
  }
}

export default CollapsePanel;
