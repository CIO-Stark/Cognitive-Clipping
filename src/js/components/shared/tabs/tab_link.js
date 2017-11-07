import React from 'react';

const TabLink = props => {
  return (
    <li className={props.className} onClick={props.onChange} data-linkTo={props.linkTo} data-index={props.index}>
      <a>{ props.label }</a>
    </li>
  );
};

export default TabLink;