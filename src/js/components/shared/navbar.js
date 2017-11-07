import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

const APP_NAME = 'IBM Cognitive Clipping';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeColorSwitch: "active"
    }
  }

  activateColorSwitch() {
    if (this.state.activeColorSwitch === "inactive") {
      this.setState({
        activeColorSwitch: "active"
      });
    }
    else {
      this.setState({
        activeColorSwitch: "inactive"
      });
    }
  };

  render() {
    // for convinience
    const path = this.props.location.pathname;
    const shouldDisplayMenu = path !== '/';
    const shouldDisplayWidget = path === '/dashboard';

    if (this.props.location.pathname === '/login') {
        return null;
    }

    return (
      <nav className="nav bg_blue">
        {/* Menu Icon and App name */}
        <div className="nav-left">
          <div className="nav-item">
            {
              shouldDisplayMenu ?
                <span className="icon clickable" data-action="menu" onClick={event => { this.props.onButtonClick(event, 'menu') }}>
                  <i className="ibm-icon-extra menu"></i>
                </span> : null
            }
          </div>

          <div className="nav-item logo">
            <Link to="/">{APP_NAME}</Link>
          </div>
        </div>

        <div className="nav-right">
          {/* Share Link */}
          {
            shouldDisplayWidget ?
              <div className="nav-item">
                <span className="icon clickable" data-action="color" onClick={event => { this.props.onButtonClick(event, 'link') }}>
                  <i className="ibm-icon ibm-collaborate-group"></i>
                </span>
              </div> : null
          }
          {/* Color Switch */}
          {
            shouldDisplayWidget ?
              <div className="nav-item">
                <span className="icon clickable" data-action="color" onClick={event => { this.props.onButtonClick(event, 'color', this.activateColorSwitch()) }}>
                  <i className={"colorIcon fa fa-paint-brush " + this.state.activeColorSwitch}></i>
                </span>
              </div> : null
          }
          {/* Widget */}
          <div className="nav-item">
            {
              shouldDisplayWidget ?
                <span className="icon clickable" data-action="widget" onClick={event => { this.props.onButtonClick(event, 'widget') }}>
                  <i className="ibm-icon ibm-template"></i>
                </span> : null
            }
          </div>
          {/* Admin */}
          <div className="nav-item">
            <a href='/admin'>
              <span className="icon clickable" data-action="admin">
                <i className="ibm-icon ibm-settings-manage_l"></i>
              </span>
            </a>
          </div>
          {/* Info */}
          <div className="nav-item">
            <span className="icon clickable" data-action="info" onClick={event => { this.props.onButtonClick(event, 'info') }}>
              <i className="ibm-icon ibm-info-moreinfo"></i>
            </span>
          </div>
        </div>

      </nav>
    );
  }
}

NavBar = withRouter(NavBar);

export default NavBar;