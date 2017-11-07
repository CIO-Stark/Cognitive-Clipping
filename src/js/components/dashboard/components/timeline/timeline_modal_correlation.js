import React from 'react';

const TimeLineModalCorrelation = props => {
  const title = props.title + ': ';
  const itens = props.correlations.join(', ');

  return (
    <div className="">
      <p className="">{ title }</p>
      <p className="correlation-response">{ itens }</p>
    </div>
  );
};

export default TimeLineModalCorrelation;