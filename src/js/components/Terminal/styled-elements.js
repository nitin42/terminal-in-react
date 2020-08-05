import styled, { keyframes } from 'styled-components';

export const Base = styled.div`
  width: 100%;
  max-width: ${props => (props.fullscreen ? '100%' : '600px')};
  height: ${props => (props.fullscreen ? '100%' : '630px')};
  max-height: 100vh;
  text-align: initial;
`;

const DEFAULT_FONT_STYLE = `
  font-family: 'Inconsolata', monospace;
  font-size: 0.9em;
  color: green;
`;

export const ContainerWrapper = styled.div`
  height: 100%;
  animation: fadeIn 0.18s ease-in;
  color: ${props => props.theme.color};
  ${DEFAULT_FONT_STYLE}
`;

const terminalFadeIn = keyframes`
  0% {
    opacity: 0;
  }

  60% {
    opacity: 0.6;
  }

  100% {
    opacity: 1;
  }
`;

export const Note = styled.span`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  animation: ${terminalFadeIn} 0.3s ease-in;
`;
