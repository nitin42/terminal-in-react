import React from 'react';
import styled from 'styled-components';
import createPseudoFileSystem from 'terminal-in-react-pseudo-file-system-plugin'; // eslint-disable-line
import ViPlugin from 'terminal-in-react-vi-plugin'; // eslint-disable-line

import { storiesOf } from '@storybook/react'; // eslint-disable-line

import Terminal from '../src/js/components/Terminal/index';

const FileSystemPlugin = createPseudoFileSystem('/', 'db');

const TerminalWrapper = styled.div`
  width : 100vw;
  height: 100vh;
`;

const withWrapper = child => () => (<TerminalWrapper>{child}</TerminalWrapper>);

storiesOf('Terminal', module)
  .add('basic', withWrapper(
    <Terminal
      msg="Hi everyone! This is a terminal component for React"
      commands={{ website: () => 'website', intro: () => 'My name is Foo!' }}
      descriptions={{ website: 'My website', intro: 'My introduction' }}
    />,
  ))
  .add('maximised', withWrapper(
    <Terminal
      msg="Hi everyone! This is a terminal component for React"
      commands={{ website: () => 'website', intro: () => 'My name is Foo!' }}
      descriptions={{ website: 'My website', intro: 'My introduction' }}
      startState="maximised"
    />,
  ))
  .add('with custom colors', withWrapper(
    <Terminal
      color="blue"
      backgroundColor="red"
      barColor="pink"
      prompt="white"
      msg="Hi everyone! This is a terminal component for React"
      commands={{ website: () => 'website', intro: () => 'My name is Foo!' }}
      descriptions={{ website: 'My website', intro: 'My introduction' }}
    />,
  ))
  .add('with FileSystem plugin', withWrapper(
    <Terminal
      plugins={[
        FileSystemPlugin,
      ]}
    />,
  ))
  // .add('with FileSystem And VI plugin', withWrapper(
  //   <Terminal
  //     plugins={[
  //       FileSystemPlugin,
  //       {
  //         class: ViPlugin,
  //         config: {
  //           filesystem: FileSystemPlugin.displayName,
  //         },
  //       },
  //     ]}
  //   />,
  // ))
;
