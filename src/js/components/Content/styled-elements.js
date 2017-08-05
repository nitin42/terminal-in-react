import styled from 'styled-components';

export const TerminalContainer = styled.div`
 display: block;
 margin: 0 auto;
`;

export const TerminalContainerMain = TerminalContainer.extend`
  max-width: 600px;
  transition: all 0.4s ease-out;
  background: ${props => props.theme.backgroundColor};
  max-height: 600px;
  height: 100%;
  overflow: scroll;
  position: relative;

  &:focus {
    outline: none;
  }
`;

const terminalOutputLineStyle = `
  font-family: 'Inconsolata', monospace;
  font-size: 0.9em;
  color: green; 
  margin-top: 10px;
  margin-bottom: 10px;
  white-space: pre-wrap;
`;
export const TerminalOutputLine = styled.div`${terminalOutputLineStyle}`;
export const PreTerminalOutputLine = styled.pre`${terminalOutputLineStyle}`;

export const TerminalInput = styled.div`
  display: flex;
  align-items: center;
  padding-top: 15px;
  padding-bottom: 15px;
`;

export const TerminalPrompt = styled.span`
  color: ${props => props.theme.prompt};
`;

export const TerminalMainInput = styled.input `
  font: inherit;
  font-size: 0.9em;
  &, &:focus{
    border: none;
    padding: 0;
    margin: 3px;
    background: ${props => props.theme.backgroundColor};
    color: ${props => props.theme.color};
    flex: 1;
    outline: none;
   }
`;

export const TerminalHolder = styled.div`
`;

export const TerminalContent = styled.div`
  padding: 5px 20px;
  height: 100%;
`;

export const TerminalInputArea = styled.div`
  height: 100%;
  padding: 3px;
`;

