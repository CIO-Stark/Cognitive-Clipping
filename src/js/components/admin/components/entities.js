import React, { Component } from 'react';

import entities from '../../../data/entity';

import '../../../../css/admin.scss';

class Entities extends Component {

    constructor(props) {
        super(props);

        this.state = {
            entities: []
        }

        this.removeEntity = this.removeEntity.bind(this);
        this.createEntity = this.createEntity.bind(this);

    }

    componentDidMount() {
    }

    createEntity(event) {

        let entity = document.getElementById('createEntity').value;
        let entitiesState = this.props.entities;

        entities.entityCreate({ entity: entity }).then(response => {
            if (response.status) {
                entitiesState.push({ value: entity, id: { _id: response.id, _rev: response.rev } });
                this.props.loadEntity()
            }
        }).catch();

    }

    removeEntity(entity) {

        let id = entity.id;
        let name = entity.value;
        let entitiesState = this.props.entities;

        entities.entityDelete(id).then(response => {
            if (response) {
                entitiesState.some((element, index) => {
                    if (element.id._id === id._id) {
                        entitiesState.splice(index, 1);
                        this.props.loadEntity()
                        return true
                    }
                })
            }
        })


    }

    removeInfo(event) {
        let parent = event.target.parentNode.parentNode.parentNode;
        let child = event.target.parentNode.parentNode;
        parent.removeChild(child);
    }

    render() {
        return (
            <div>
                <article className="message is-info">
                    <div className="message-header">
                        Info
                        <button className="delete" onClick={this.removeInfo}></button>
                    </div>
                    <div className="message-body">
                        <p>
                            Entidades são pessoas, instituições, empresas, hashtags ou qualquer termo pesquisável na internet. Elas são a base da busca dos seus usuários no IBM Cognitive Clipping.
                        </p>
                    </div>
                </article>

                <div className="field has-addons">
                    <p className="control">
                        <input id='createEntity' className="input" type="text" placeholder="Nova entidade" />
                    </p>
                    <p className="control">
                        <a onClick={this.createEntity} className="button is-info">
                            Adicionar Entidade
                        </a>
                    </p>
                </div>

                <div className='entities-tags'>
                    {this.props.entities.map((entity, index) => {
                        return (
                            <span key={index} className="tag is-large">
                                <span>{entity.value}</span>
                                <button className="delete" onClick={event => { this.removeEntity(entity) }}></button>
                            </span>
                        )
                    })}
                </div>

            </div>
        );
    }
}

export default Entities;