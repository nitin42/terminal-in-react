import styled from 'styled-components';

export const TerminalTabBar = styled.div`
  height: 30px;
  max-width: 600px;
  transition: all 0.4s ease-out;
  background: #222;
  display: flex;
  margin: 0 auto;
`;


export const TerminalTabBarEmpty = styled.div`
  display: inline-block;
  min-width: 25px;
  height: 100%;
  flex: 1;
`;

export const TerminalTabClose = styled.div`
  position: absolute;
  top: 8px;
  height: 13px;
  line-height: 11px;
  right: 3px;
  font-size: 11px;
  width: 13px;
  text-align: center;
  color: black;
  cursor: pointer;

  &:hover {
    color: white;
    background-color: black;
    border-radius: 50%;
  }
`;

export const TerminalTab = styled.div`
  display: inline-block;
  vertical-align: top;
  height: 30px;
  background-color: #333;
  border-bottom: 2px solid #333;
  border-bottom-color: ${props => props.active ? '#777' : '#333' }
  text-align: center;
  line-height: 30px;
  width: 100px;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 3px;
  padding-right: 3px;
  cursor: pointer;
  white-space: pre;
  position: relative;
  
  &:focus {
    outline: none;
  }
`;

export const TerminalTabPlus = styled.div`
  display: inline-block;
  color: white;
  border: 1px solid white;
  border-radius: 2px;
  width: 13px;
  height: 13px;
  line-height: 13px;
  margin-left: 5px;
  margin-top: 8px;
  text-align: center;
  font-size: 12px;
  cursor: pointer;
  opacity: ${props => props.visible ? '0.7' : '0' };
  transition: opacity 0.3s;
`;
