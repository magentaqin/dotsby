import React from 'react';
import styled from 'styled-components';

const StyledDivider = styled.div`
  height: 1px;
  width: '100%';
  background-color: ${props => props.theme.dividerColor};
`

const Divider = (props) => {
  return (
    <StyledDivider />
  )
}

export default Divider;
