import React from 'react';
import PropTypes from 'prop-types';
import './Bar.css';

const Bar = ({ style }) => (
  <div id="bar" style={style} className="adjust-bar">
    <svg height="20" width="100">
      <circle cx="24" cy="14" r="5" fill="red" />
      <circle cx="44" cy="14" r="5" fill="orange" />
      <circle cx="64" cy="14" r="5" fill="green" />
    </svg>
  </div>
);

Bar.propTypes = {
  style: PropTypes.object, // eslint-disable-line
};

Bar.defaultProps = {
  style: {},
};

export default Bar;
