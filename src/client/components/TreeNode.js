/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import { SmallArrow } from './Arrow';

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

const TreeNode = (props) => {
  const { id, data } = props;
  const { displayName, type, description, required, example } = data
  const enumText = data.enum;
  return (
    <PanelWrapper key={id}>
      <LeftItem>
        <FlexRow>
          {props.children ? <div><SmallArrow /></div> : null }
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
      {props.children}
    </PanelWrapper>
  )
}

export default TreeNode;