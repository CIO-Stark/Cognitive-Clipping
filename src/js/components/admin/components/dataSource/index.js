import React, { Component } from 'react';

import Article from './components/article';
import Facebook from './components/facebook';
import Twitter from './components/twitter';
import File from './components//file';

class DataSource extends Component {

    constructor(props) {
        super(props);
    }

    contentValidation(event) {

        let name = event.target.parentNode.getAttribute('name');

        let timeLineContent = document.getElementById('sources').childNodes;

        if (!event.target.parentNode.classList.value) {
            timeLineContent.forEach(function (element) {
                if (element.classList.value === 'is-hidden' && element.getAttribute('name') === name) {
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
        return (
            <div>
                <div className="columns">
                    <div className="column">
                        <div className="tabs is-toggle is-fullwidth">
                            <ul>
                                <li name='articles' className="is-active" onClick={this.contentValidation}><a>Artigos</a></li>
                                <li name='facebook' onClick={this.contentValidation}><a>Facebook</a></li>
                                <li name='twitter' onClick={this.contentValidation}><a>Twitter</a></li>
                                <li name='file' onClick={this.contentValidation}><a>Arquivos</a></li>
                            </ul>
                        </div>
                        <div id='sources'>
                            <div name='articles'>
                                <Article />
                            </div>
                            <div className='is-hidden' name='facebook' >
                                <Facebook entities={this.props.entities} />
                            </div>
                            <div className='is-hidden' name='twitter' >
                                <Twitter entities={this.props.entities} />
                            </div>
                            <div className='is-hidden' name='file' >
                                <File />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DataSource;