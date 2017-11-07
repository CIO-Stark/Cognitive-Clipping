import React from 'react';

const Keyword = props => {
    const keywords = props.words.slice(0,5).map((keyword, index) => {
        return (<p key={index}>{`${++index} - ${keyword}`}</p>)
    });

    return (
        <div className='insight notification is-small'>
            <h5 className='title is-6' style={{marginBottom: '10px'}}>Top Keywords</h5>
            { keywords }
        </div>
    );
};

export default Keyword;