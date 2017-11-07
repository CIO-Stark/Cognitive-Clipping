import React from 'react';

const NegativeAverage = props => {
    return (
        <div className="insight">
            <h2 className='title insightTitle is-5'>{ props.title }</h2>
            <h1 className='title is-1 has-text-centered insightPercent'>{ `${props.value.percentage}%` }</h1>
            <p className='insightText'>{ props.text }</p>
        </div>
    );
}

export default NegativeAverage;