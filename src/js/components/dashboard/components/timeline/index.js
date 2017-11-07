import React, { Component } from 'react';
import TimeLineItem from './timeline_item';
import TimeLineDate from './timeline_date';
import InfiniteScroll from 'react-infinite-scroller';
import DateSlider from '../../../shared/date_slider';
import form from '../../../shared/form';

const moment = require('moment');

/**
 * Take a list of documents and create a timeline with it
 * Properties:
 * list (array) -> list of documents
 */

class TimeLine extends Component {

  constructor(props, context) {
    super(props, context);

    this.chunkSize = 10;
    this.updateCount = 0; // 
    this.listLength = this.props.list.length;
    this.state = {
      list: [],
      hasMoreItems: true,
      height: 0,
      scroll: true,
      page: -1
    };

    this.updated = 0;
    this.shouldUpdate = true;

    this.loadMoreItems = this.loadMoreItems.bind(this);
    this.onItemClick = this.onItemClick.bind(this);
  }

  componentDidMount() {
    let parent = this.container.parentNode;
    while (true) {
      if (parent.classList.contains('widget-container')) {
        break;
      }
      parent = parent.parentNode;
    }

    let height = parent.clientHeight - 56;
    this.setState({ height });
  }

  loadMoreItems(page) {
    page = ++this.state.page;
    // console.log('Page: ', page);
    const offset = page * this.chunkSize;
    const newItems = this.props.list.slice(offset, (offset + this.chunkSize));
    let hasMoreItems = this.state.hasMoreItems;

    if (newItems.length < this.chunkSize) {
      hasMoreItems = false;
    }
    this.setState({ list: this.state.list.concat(newItems), hasMoreItems });
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.updatesOnTimeline > this.updated) {
      this.shouldUpdate = true;
      this.updated = nextProps.updatesOnTimeline;
      this.setState({ list: [], page: -1, hasMoreItems: true }, () => { this.loadMoreItems(0); });
    } else {
        this.shouldUpdate = false;
    }
  }

  shouldComponentUpdate () {
      return this.shouldUpdate;
  }

  componentWillUnmount() {
    this.container = null;
  }

  onItemClick (item) {
      this.props.correlate(item, 'timeline');
  }

  render() {
    let list = this.state.list;
    let items = {};
    let index = 0;

    // arranging the list to display each item based on it's date
    list.forEach((item, index) => {
      const date = item.date.trim();
      if (!items[date]) {
        items[date] = [];
      }

      items[date].push(item);
    });

    // building child components 
    let display = [];
    for (let date in items) {
      display.push(<TimeLineDate key={index++} date={date} />)

      display = display.concat(items[date].map(item => {
        return <TimeLineItem key={index++} item={item} list={list} onItemClick={this.onItemClick} />
      }));
    }

    return (
      <div className="timeline widgetContentTimeline" ref={element => { this.container = element; }}>
        {
            this.props.date ?
            <div style={{ padding: "0 1rem", margin: "0 0 1rem 0" }}>
                <DateSlider min={this.props.date.min} max={this.props.date.max} onChange={this.props.dateValidation} />
            </div> :
            null
        }
        <div className="vertical-line"></div>
        <div className="timeline-container" style={{ height: this.state.height }}>
          <InfiniteScroll
            pageStart={-1}
            loadMore={this.loadMoreItems}
            hasMore={this.state.hasMoreItems}
            loader={null}
            useWindow={false}>
            {display}
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

export default TimeLine;