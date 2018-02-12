/* global describe, it, expect */
import React from 'react';
import renderer from 'react-test-renderer';
import createPseudoFileSystem from 'terminal-in-react-pseudo-file-system-plugin'; // eslint-disable-line
import Terminal from '../src/js/components/Terminal/index';

const FileSystemPlugin = createPseudoFileSystem();

const Term = (
  <Terminal
    backgroundColor="yellow"
    msg="Hello World. My name is Nitin Tulswani"
    commands={{
      run: () => 'running something...',
    }}
    descriptions={{ run: 'Run something' }}
  />
);

const Term2 = (
  <Terminal
    plugins={[
      FileSystemPlugin,
    ]}
  />
);

describe('Terminal Component', () => {
  it('should be a function', () => {
    expect(typeof Terminal).toBe('function');
  });

  it('should render a terminal component', () => {
    const tree = renderer.create(Term).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should work with plugins', () => {
    const tree = renderer.create(Term2).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
