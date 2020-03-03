/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import ArrowSrc from '../assets/small-arrow.svg'

const PanelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
`

const LeftItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  padding-left: ${props => props.nestedLevel * 16}px;
  flex: 1;
  display: ${props => (props.shouldShow ? 'inherit' : 'none')};
`
const RightItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex: 1;
  padding: 8px 32px 8px 0;
  display: ${props => (props.shouldShow ? 'inherit' : 'none')};
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

const SmallArrow = styled.img`
  transform: ${props => (props.shouldRotate ? 'rotate(-90deg)' : '')};
  margin-right: 4px;
`

const TreeNode = (props) => {
  const { id, data, parentId, expandedIds } = props;
  const { displayName, type, description, required, example } = data
  const enumText = data.enum;
  const nestedLevel = id.split('-').length - 1;
  let style = { cursor: 'pointer'};
  if (!props.children) {
    style = { display: 'none'}
  }

  const toggleExpand = (id, children) => (e) => {
    e.stopPropagation();
    if (children) {
      props.toggleExpand(id)
    }
  }
  let shouldShow = true;
  let shouldRotate = true;
  if (expandedIds.includes(parentId)) {
    shouldShow = true;
  } else {
    shouldShow = false;
  }
  const firstChildId = parentId + '-0';
  if (expandedIds.includes(firstChildId)) {
    shouldRotate = false
  }
  return (
    <PanelWrapper key={id} onClick={toggleExpand(id, props.children)}>
      <LeftItem nestedLevel={nestedLevel} shouldShow={shouldShow}>
        <FlexRow>
          <div style={style}>
            <SmallArrow src={ArrowSrc} shouldRotate={shouldRotate}/>
          </div>
          <p>{displayName}</p>
          <TypeText>{type}</TypeText>
        </FlexRow>
        <NoteText>{description}</NoteText>
      </LeftItem>
      <RightItem shouldShow={shouldShow}>
        <RequiredText>{required ? 'Required' : 'Optional'}</RequiredText>
        <NoteText>{enumText}</NoteText>
        <NoteText>{example}</NoteText>
      </RightItem>
      {props.children}
    </PanelWrapper>
  )
}

export default TreeNode;