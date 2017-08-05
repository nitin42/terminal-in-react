/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';

export const TerminalTopBar = styled.div`
  height: 30px;
  max-width: 600px;
  transition: all 0.4s ease-out;
  background: ${props => props.theme.barColor};
  display: block;
  margin: 0 auto;
`;
