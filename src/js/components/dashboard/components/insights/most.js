import React, { Component } from 'react';
import TimeLineItem from '../timeline/timeline_item';
import TimeLineModal from './../timeline/timeline_modal';
import * as modalService from '../../../shared/modal/modal_service';

function createExcerpt (text) {
    const LIMIT = 110;
    const STOP_SYMBOLS = [',', ' ', '.'];
    let spliced = text.slice(0, LIMIT);

    if (STOP_SYMBOLS.indexOf(spliced[spliced.length - 1]) === -1) {
        let i = LIMIT;
        while(STOP_SYMBOLS.indexOf(spliced[spliced.length - 1]) === -1) {
            spliced += text[++i];
        }
    }

    return spliced + '...';
}

function openModal (item) {
    modalService.open(<TimeLineModal item={item} isActive={true} list={[]} />);
}

const Most = props => {
    const data = props.item.data;
    const text = createExcerpt(data.translations.portuguese);
    
    return (
        <div className="insight notification most">
            <h2 className="title is-6">{ props.title }</h2>
            <p>{ text }</p>

            <span className="icon expand clickable" onClick={() => { openModal(data); }}>
                <i className="ibm-icon ibm-maximize"></i>
            </span>
        </div>
    );
};

export default Most;