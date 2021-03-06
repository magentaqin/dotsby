import React from 'react';
import styled from 'styled-components';

const StyledArrow = styled.svg`
  transform: ${props => (props.isUpper ? 'rotate(180deg)' : '')};
  display: ${props => (props.shouldShow ? 'inherit' : 'none')};
`

export const BigArrow = (props) => {
  return (
    <StyledArrow width="24" height="24" viewBox="0 0 24 24" shouldShow={!props.isMatched} isUpper={!props.shouldShow}>
      <path d="M19.2579 8.35847C18.8674 7.96795 18.2342 7.96795 17.8437 8.35847L12.3082 13.894L6.70708 8.29289C6.31655 7.90237 5.68338 7.90237 5.29286 8.29289C4.90234 8.68342 4.90234 9.31658 5.29286 9.70711L11.5355 15.9497C11.5465 15.9608 11.5578 15.9715 11.5692 15.9819C11.5795 15.9932 11.5901 16.0044 11.6011 16.0153C11.9916 16.4058 12.6248 16.4058 13.0153 16.0153L19.2579 9.77269C19.6484 9.38216 19.6484 8.749 19.2579 8.35847Z" fill="#CCD8CC"/>
    </StyledArrow>
  )
}

export const BigArrowActive = (props) => {
  return (
    <StyledArrow width="24" height="24" viewBox="0 0 24 24" shouldShow={props.isMatched} isUpper={!props.shouldShow}>
      <path d="M19.2579 8.35847C18.8674 7.96795 18.2342 7.96795 17.8437 8.35847L12.3082 13.894L6.70708 8.29289C6.31655 7.90237 5.68338 7.90237 5.29286 8.29289C4.90234 8.68342 4.90234 9.31658 5.29286 9.70711L11.5355 15.9497C11.5465 15.9608 11.5578 15.9715 11.5692 15.9819C11.5795 15.9932 11.5901 16.0044 11.6011 16.0153C11.9916 16.4058 12.6248 16.4058 13.0153 16.0153L19.2579 9.77269C19.6484 9.38216 19.6484 8.749 19.2579 8.35847Z" fill="#3f20ba"/>
    </StyledArrow>
  )
}

