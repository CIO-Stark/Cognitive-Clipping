import React, { Component } from 'react';
import * as Service from './modal_service';

class Modal extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            childrens: [],
            isActive: false
        };

        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
    }

    show(content) {
        let childrens = this.state.childrens;
        childrens.push(content);

        let isActive = this.state.isActive;
        if (this.state.childrens.length !== 0) {
            isActive = true;
        }

        this.setState({ isActive: isActive, childrens: childrens });
    }

    hide() {
        let childrens = this.state.childrens;
        childrens.pop();

        let isActive = this.state.isActive;
        if (this.state.childrens.length === 0) {
            isActive = false;
        }

        this.setState({ isActive: isActive, childrens: childrens });
    }

    componentDidMount() {
        Service.subscribe('open', this.show);
        Service.subscribe('dismiss', this.hide);
    }

    render() {
        const className = this.state.isActive ? 'modal is-active' : 'modal';

        return (
            <div className={className}>
                <div className="modal-background" onClick={this.hide}>
                    <button className="modal-close is-large" aria-label="close"></button>
                </div>
                {this.state.childrens.map((children, index) => {
                    return (
                        <div key={index} className="modal-content">
                            {children}
                        </div>
                    )
                })}
            </div>
        );
    }
}

export default Modal;