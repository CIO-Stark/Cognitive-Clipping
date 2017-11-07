import React, { Component } from 'react';
import Joyride from 'react-joyride';

import entitiesApi from '../../data/entity';

import Entities from './components/entities';
import DataSource from './components/dataSource/index';
import Users from './components/users';

import * as Toast from '../shared/toast/toast_service';

class Admin extends Component {

    constructor(props) {
        super(props)

        this.state = {
            entities: []
        }
        this.loadEntity = this.loadEntity.bind(this);
    }

    contentValidation(event) {

        let name = event.target.parentNode.getAttribute('name');

        let timeLineContent = document.getElementById('timeLineContent').childNodes;

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

    componentDidMount() {
        this.getEntities();
    }

    loadEntity() {
        this.getEntities();
    }

    getEntities() {
        entitiesApi.get().then(response => {
            var that = this;
            this.setState({ entities: response }, function () {});
        }).catch(error => {
            console.error(error);
            Toast.open('Erro ao carregar a lista de entidades. Tente mais tarde.', 'danger');
        });
    }

    render() {
        return (
            <div className="hero-body is-light">
                <div className="container">
                    <div className="columns">
                        <div className="column">
                            <h1 className="title">Gerenciador</h1>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <div className="tabs">
                                <ul>
                                    <li name='entities' className="is-active" onClick={this.contentValidation}><a>Entidades</a></li>
                                    <li name='data' onClick={this.contentValidation}><a>Fontes de Dados</a></li>
                                    <li name='users' onClick={this.contentValidation}><a>Usuários</a></li>
                                </ul>
                            </div>
                            <div id='timeLineContent'>
                                <div name='entities'>
                                    <Entities entities={this.state.entities} loadEntity={this.loadEntity} />
                                </div>
                                <div className='is-hidden' name='data' >
                                    <DataSource entities={this.state.entities} />
                                </div>
                                <div className='is-hidden' name='users' >
                                    <Users />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Admin;