import React from 'react';
import './Bar.css';

let Bar = ({ style }) => {
	return (
    <div id="bar" style={ style } className='adjust-bar'>
      <svg height="20" width="100">
        <circle cx="24" cy="14" r="5" fill="red" />
        <circle cx="44" cy="14" r="5" fill="orange" />
        <circle cx="64" cy="14" r="5" fill="green" />
      </svg>
    </div>
	);
}

export default Bar;