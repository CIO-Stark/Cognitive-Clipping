import React, { Component } from 'react';
import TimeLine from './timeline';
import { Tabs, TabLink, TabContent } from '../../shared/tabs';

class TimeLineTabs extends Component {

  constructor(props) {
    super(props);
  }

  contentValidation(event) {

    let timeLineContent = document.getElementById('timeLineContent').childNodes;

    if (!event.target.parentNode.classList.value) {
      timeLineContent.forEach(function (element) {
        if (element.classList.value === 'is-hidden') {
          element.classList.value = '';
        } else {
          element.classList.value = 'is-hidden';
        }
      }, this);
      event.target.parentNode.parentNode.childNodes.forEach(function (element) {
        if (element.classList.value === 'is-active') {
          element.classList.value = '';
        }
      }, this);
      event.target.parentNode.classList.value = "is-active";
    } else {

    }

  }

  render() {
    let docList = [];
    let socialList = [];
    let lastDoc = null;
    let list = this.props.data;

    if (list) {
      list.some(item => {
        if (item.source === 'filecrawler') {
          docList.push(item);
        } else {
          socialList.push(item);
        }
      });
    }

    return (
      <div className="">
        <div className="tabs timeline-tab is-centered">
          <ul>
            <li className="is-active" name='s_e_a' onClick={this.contentValidation}><a>Social & Artigos</a></li>
            <li name='docs' onClick={this.contentValidation}><a>Documentos</a></li>
          </ul>
        </div>
        <div id='timeLineContent'>
          <div>
            <TimeLine
                list={socialList} 
                date={this.props.date} 
                dateForm={this.props.dateForm}
                correlate={this.props.correlate}
                dateValidation={this.props.dateValidation} 
                updatesOnTimeline={this.props.updatesOnTimeline} />
          </div>
          <div className='is-hidden'>
            <TimeLine
                list={docList}
                date={this.props.date} 
                dateForm={this.props.dateForm}
                correlate={this.props.correlate}
                dateValidation={this.props.dateValidation} 
                updatesOnTimeline={this.props.updatesOnTimeline}  />
          </div>
        </div>
      </div>
    );
  }
}

export default TimeLineTabs;