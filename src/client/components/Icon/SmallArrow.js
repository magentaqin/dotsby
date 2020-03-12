import React from 'react';
import styled from 'styled-components';

const StyledArrow = styled.svg`
  transform: ${props => (props.shouldRotate ? 'rotate(-90deg)' : '')};
  margin-right: 4px;
`

const SmallArrow = (props) => {
  return (
    <StyledArrow t="1584015444843" viewBox="0 0 1024 1024" version="1.1" p-id="1140" width="20" height="20" shouldRotate={props.shouldRotate}>
      <path d="M232 392L512 672l280-280z" fill="#2c2c2c" p-id="1141"></path>
    </StyledArrow>
  )
}

export default SmallArrow;