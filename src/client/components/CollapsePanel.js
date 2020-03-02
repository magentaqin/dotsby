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
  padding-left: ${props => props.nestedLevel * 16 + 16}px;
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

  toggleExpand = (count) => () => {
    console.log('called')
    let expandedItems = []
    if (this.state.expandedItems.includes(count)) {
      expandedItems = this.state.expandedItems.filter(item => item !== count);
      this.count = 0;
      this.nestedLevel = 0;
    } else {
      expandedItems = [...this.state.expandedItems]
      expandedItems.push(count)
      this.count = 0;
      this.nestedLevel = 0;
    }
    this.setState({ expandedItems })
  }

  renderNestedPanel = (data) => {
    return data.map((item, index) => {
      let {
        displayName,
        type,
        description,
        required,
        example,
      } = item
      const enumText = item.enum;
      let properties = item.properties ? item.properties : []

      // handle json schema type
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
        properties = [...properties, ...schemaProperties]
      }

      const isNested = !!((properties && properties.length));


      // this count is previous count.
      if (this.state.expandedItems.includes(this.count)) {
        this.nestedLevel += 1;
      }

      // this count is current count
      this.count += 1;
      const shouldExpand = this.state.expandedItems.includes(this.count);
      return (
        <div key={index}>
          <PanelWrapper count={this.count}>
            <LeftItem nestedLevel={this.nestedLevel}>
              <FlexRow>
                {isNested ? <div onClick={this.toggleExpand(this.count)}><SmallArrow /></div> : null }
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
          {isNested && shouldExpand ? this.renderNestedPanel(properties) : null }
        </div>
      )
    })
  }

  renderPanel = (data) => {
    return data.map((item, index) => {
      let {
        displayName,
        type,
        description,
        required,
        example,
      } = item
      const enumText = item.enum;
      let properties = item.properties ? item.properties : []

      // handle json schema type
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
        properties = [...properties, ...schemaProperties]
      }

      console.log('PARENT', index)

      // total row count
      this.count += 1;
      this.nestedLevel = 0;

      const isNested = !!((properties && properties.length));
      const shouldExpand = this.state.expandedItems.includes(this.count);
      console.log('count', this.count)
      return (
        <div key={index}>
          <PanelWrapper count={this.count}>
            <LeftItem nestedLevel={0}>
              <FlexRow>
                {isNested ? <div onClick={this.toggleExpand(this.count)}><SmallArrow /></div> : null }
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
          {isNested && shouldExpand ? this.renderNestedPanel(properties) : null }
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
