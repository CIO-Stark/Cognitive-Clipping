import React from 'react';

const Widget = props => {    
  return (
    <div {...props} className={'widget-container ' + props.className}>
      { props.children }
    </div>
  );
};

export default Widget;    