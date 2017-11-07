import React, { Component } from 'react';
import TimeLineModal from './timeline_modal';
import * as modalService from '../../../shared/modal/modal_service';
import * as utils from '../../../../utils/utils';

const source = {
  filecrawler: 'Arquivo',
  twitter: 'Twitter',
  facebook: 'Facebook',
  nodecrawler: 'Artigo',
  'connections': 'Connections'
};

class TimeLineItem extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      isOpen: false,
      openModal: false
    };

    this.handleOpenChange = this.handleOpenChange.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  handleOpenChange(event) {
    this.setState({ isOpen: !this.state.isOpen });
  }

  toggleModal(event) {
    this.setState({ openModal: !this.state.openModal });
    modalService.open(<TimeLineModal item={this.props.item} isActive={this.state.openModal} list={this.props.list} onDismiss={this.toggleModal} />);
  }

  printSource(item) {
    switch (item.source) {
      case 'twitter': return <a href={item.link} target="_blank">{source[item.source]}</a>;
      case 'facebook': return source[item.source];
      case 'nodecrawler': return <a href={item.link} target="_blank">{utils.captalize(item.profile)}</a>;
      case 'filecrawler': return source[item.source];
      case 'connections': return <a href={item.link} target="_blank">{source[item.source]}</a>;
    }
  }

  handleItemClick (event) {
    console.log(event.target);
    // onItemClick
  }

  render() {
    if (!this.props.item || !Object.keys(this.props.item).length) {
        return null;
    }

    const list = this.props.list;
    const item = this.props.item;
    const snippet = item.portuguese ? item.portuguese.slice(0, 500) : item.text;
    const className = 'timeline-item ' + item.sentiment.label;
    let keywords = item.keywords.length ? item.keywords.map(keyword => (keyword.text)) : null;

    if (keywords) {
      keywords = keywords.join(', ');
    }

    return (
      <div className={className} data-container>
        <hr className="line" />
        {item.title ? <h3 className="ellipsis">{item.title}</h3> : ''}

        <p className="block-with-text snippet">
          {snippet}
        </p>

        {
          this.state.isOpen ?
            <div className="key-words">
              <p className="gray"><span className="bold">Palavras-chave:</span> {keywords} </p>
            </div> : ""
        }

        <div className="bottom">
          <span className="source">{ this.printSource(item) }</span>
          <span className="actions">
            <span className="icon" onClick={() => { this.props.onItemClick(item); }}>
                <i className="ibm-icon ibm-flow"></i>
            </span>
            <span className="icon" onClick={this.toggleModal}>
              <i className="ibm-icon ibm-maximize"></i>
            </span>

            {
              this.state.isOpen ?
                <span className="icon" onClick={this.handleOpenChange}>
                  <i className="ibm-icon ibm-remove-delete"></i>
                </span> :
                <span className="icon" onClick={this.handleOpenChange}>
                  <i className="ibm-icon ibm-add-new"></i>
                </span>
            }
          </span>
        </div>
      </div>
    );
  }
}

export default TimeLineItem;
// { this.state.openModal ? <TimeLineModal item={this.props.item} isActive={this.state.openModal} onDismiss={this.toggleModal}  /> : '' }
// <p className="gray"><span className="bold">Correlações:</span>  @TODO</p>