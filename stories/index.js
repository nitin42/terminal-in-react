import React from 'react';
import styled from 'styled-components';
import PseudoFileSystem from 'terminal-in-react-pseudo-file-system-plugin'; // eslint-disable-line

import { storiesOf } from '@storybook/react';

import Terminal from '../src/js/components/Terminal/index';

const TerminalWrapper = styled.div`
  width : 100vw;
  height: 100vh;
`;

storiesOf('Terminal', module)
  .add('basic', () => (<TerminalWrapper>
    <Terminal
      msg="Hi everyone! This is a terminal component for React"
      commands={{ website: () => 'website', intro: () => 'My name is Foo!' }}
      descriptions={{ website: 'My website', intro: 'My introduction' }}
    /></TerminalWrapper>))
  .add('maximised', () => (<TerminalWrapper>
    <Terminal
      msg="Hi everyone! This is a terminal component for React"
      commands={{ website: () => 'website', intro: () => 'My name is Foo!' }}
      descriptions={{ website: 'My website', intro: 'My introduction' }}
      startState="maximised"
    /></TerminalWrapper>))
  .add('with custom colors', () => (<TerminalWrapper>
    <Terminal
      color="blue"
      backgroundColor="red"
      barColor="pink"
      prompt="white"
      msg="Hi everyone! This is a terminal component for React"
      commands={{ website: () => 'website', intro: () => 'My name is Foo!' }}
      descriptions={{ website: 'My website', intro: 'My introduction' }}
    /></TerminalWrapper>))
  .add('with FileSystem plugin', (<TerminalWrapper>
    <Terminal
      plugins={[
        new PseudoFileSystem(),
      ]}
    /></TerminalWrapper>))
;
