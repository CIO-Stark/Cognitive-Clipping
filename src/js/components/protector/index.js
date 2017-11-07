import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { isAdmin } from '../../data/auth';
import * as notification from '../shared/toast/toast_service';

class Protector extends Component {

    constructor (props) {
        super(props);
    }

    checkAdminPanelAcess () {
        const location = this.props.location;
        const { admin, index } = this.props.path.admin;

        if (location.pathname === admin && !isAdmin()) {
            this.props.history.push(index);
        }
    }

    componentDidMount () {
        this.checkAdminPanelAcess();
    }

    componentDidUpdate () {
        this.checkAdminPanelAcess();
    }

    render() {
        return null;
    }
}

export default withRouter(Protector);