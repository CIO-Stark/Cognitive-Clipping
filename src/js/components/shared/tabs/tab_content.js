import React from 'react';

const TabContent = props => {
  return (
    <div className={props.className}>
      { props.children }
    </div>
  );
};

export default TabContent;