import React, { Component } from 'react';
import TabLink from './tab_link';
import TabContent from './tab_content';

class Tabs extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = { contentName: null, index: 0 };
    this.headers = [];
    this.content = [];

    this.onChange = this.onChange.bind(this);
  }

  getContent () {
    const name = this.state.contentName;
    let content = null;

    this.content.some(element => {
      if (element.props.name === name) {
        content = element;
        return true;
      }

      return false;
    });
    
    return content;
  }

  onChange (event) {
    const li = event.target.parentNode;
    this.setState({ contentName: li.getAttribute('data-linkTo'), index: li.getAttribute('data-index')});
  }

  componentDidMount () {
    this.props.children.forEach(element => {
      if (element.type.name === 'TabLink') {
        this.headers.push(element);
      } else {
        this.content.push(element);
      }
    }, this);

    if (!this.state.contentName) {
      this.setState({ contentName: this.headers[0].props.linkTo, index: 0 });
    }
  }

  render() {
    const headers = this.headers.map((element, index) => {
      return React.cloneElement(element, { className: this.state.index == index ? "is-active" : "", index: index, key:index, onChange: this.onChange })
    }, this);

    return (
      <div className="">
       {/* Header */}
        <div className="tab-container tabs is-centered">
          <ul>
            { headers }
          </ul>
        </div>
        {/* Body */}
        <div className="tab-container">
          { this.getContent() }
        </div>
      </div>
    );
  }
}

export { Tabs, TabLink, TabContent };