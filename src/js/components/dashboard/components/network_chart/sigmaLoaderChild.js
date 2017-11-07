import React, { Component } from 'react';

export default class SigmaLoaderChild extends Component {
        constructor (props) {
                super(props);
        }

        componentDidMount () {
                this.props.setSigma(this.props.sigma);
                sigma.plugins.dragNodes(this.props.sigma, this.props.sigma.renderers[0]);
        }

        render () {
                return null;
        }
}
