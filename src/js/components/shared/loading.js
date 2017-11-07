import React from 'react';
import '../../../css/loading.scss';

const Loading = props => {

  return (
    <div className="loading-wrapper" style={{ display: props.show ? 'block' : 'none' }}>
      <div className="loading bar">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );

};

export default Loading;