import React, { Component } from 'react';

import entitiesData from '../../../../../data/entity';
import facebookData from '../../../../../data/facebook';
import * as Toast from '../../../../shared/toast/toast_service';

class Facebook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            crawling: [],
            entitySelected: '',
            quantitySelected: 25,
            pagesSelected: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.create = this.create.bind(this);
        this.entitiesLoad = this.entitiesLoad.bind(this);
        this.remove = this.remove.bind(this);
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
    }

    componentDidMount() {
        this.entitiesLoad()
    }

    entitiesLoad() {
        facebookData.load()
        .then(response => {
            // console.log(response);
            this.setState({
                crawling: response.data.rows.map((element, index) => {
                    return element;
                })
            });
        }).catch(error => {
            console.error(error);
            Toast.open('Erro ao carrega a lista de dados. Tente mais tarde.', 'danger');
        });
    }

    handleChange(event) {
        const target = event.target.id;
        const value = event.target.value;
        this.setState({ [target]: value });
    }

    create(event) {
        let facebookPages = this.state.pagesSelected.split(',');
        facebookPages = facebookPages.map(element => {
            return element.trim();
        });

        let entity = {
            entity: this.state.entitySelected,
            quantity: this.state.quantitySelected,
            pages: facebookPages
        }

        let that = this

        facebookData.create(entity)
            .then(response => {
                that.entitiesLoad();
                this.setState({
                    entitySelected: '',
                    langSelected: '',
                    quantitySelected: 100,
                    pagesSelected: ''
                })
            }).catch(error => {
                console.error(error);
            });
    }

    remove(event, entity) {
        entity = {
            _id: entity._id,
            _rev: entity._rev
        }

        let that = this

        facebookData.remove(entity)
        .then(response => {
            that.entitiesLoad();
        }).catch(error => {
            console.error(error);
            Toast.open('Erro ao remover o item selecionado. Tente mais tarde.', 'danger');
        });
    }

    start(event, entity) {
        entity = {
            _id: entity._id
        }

        let that = this

        facebookData.start(entity)
            .then(response => {
                console.log(response);
                that.entitiesLoad();
            }).catch(error => {
                console.error(error);
                Toast.open('Erro ao iniciar a coleta. Tente mais tarde.', 'danger');
            });
    }

    stop(event, entity) {
        entity = {
            _id: entity._id
        }

        let that = this

        facebookData.stop(entity)
            .then(response => {
                that.entitiesLoad();
            }).catch(error => {
                console.error(error);
                Toast.open('Erro ao parar a coleta. Tente mais tarde.', 'danger');
            });
    }

    removeInfo(event) {
        let parent = event.target.parentNode.parentNode.parentNode;
        let child = event.target.parentNode.parentNode;
        parent.removeChild(child);
    }

    render() {

        let entities = this.props.entities;

        return (
            <div>
                <article className="message is-info">
                    <div className="message-header">
                        Info
                        <button className="delete" onClick={this.removeInfo}></button>
                    </div>
                    <div className="message-body">
                        <p>As buscas no facebook devem ser realizadas baseadas em entidades e em páginas públicas do facebook.</p>
                        <p>Você pode criar buscas personalizadas para cada entidade cadastrada. Para isso, selecione uma entidade e insira quais páginas devem ser consultadas, separadas por espaço, no formulário abaixo, além de colocar um limite de artigos coletados nessa busca. Cada quantidade equivale a 25 artigos coletados.</p>
                        <p>Na listagem, você pode excluir suas buscas usando a coluna 'Ações'.</p>
                        <p>Os dados começam a ser gravados após 15 segundos da iniciação da coleta.</p>
                        <p>Certifique-se de colocar o nome exato das páginas no campo 'Páginas' ou sua busca não retornará posts.</p>
                    </div>
                </article>
                <div className='columns'>
                    <div className="column is-one-third">
                        <div className="field">
                            <label className="label">Entidade</label>
                            <p className="control">
                                <span className="select is-fullwidth">
                                    <select id='entitySelected' value={this.state.entitySelected} onChange={this.handleChange}>
                                        <option value="">Selecione a Entidade</option>
                                        {entities.map((element, index) => {
                                            return (
                                                <option value={element.value} key={index}>{element.value}</option>
                                            )
                                        })}
                                    </select>
                                </span>
                            </p>
                        </div>
                        <div className="field">
                            <label className="label">Quantidade</label>
                            <p className="control">
                                <input id='quantitySelected' className="input" type="number" placeholder="Quantidade: 0" value={this.state.quantitySelected} onChange={this.handleChange} />
                            </p>
                        </div>
                        <div className="field">
                            <label className="label">Pages</label>
                            <p className="control">
                                <textarea id='pagesSelected' className="input" placeholder="" value={this.state.pagesSelected} onChange={this.handleChange} />
                            </p>
                        </div>
                        <div className="field">
                            <p className="control">
                                <button onClick={this.create} className="button is-success">
                                    <span>Adicionar</span>
                                </button>
                            </p>
                        </div>
                    </div>
                    <div className="column">
                        <table className='table is-striped'>
                            <thead>
                                <tr>
                                    <th>Entidade</th>
                                    <th>Quantidade</th>
                                    <th>Linguagem</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.crawling.map((element, index) => {
                                    let status = undefined;
                                    let className = {
                                        play: undefined,
                                        stop: undefined
                                    }
                                    if (element.crawling) {
                                        status = 'Coletando';
                                        className.play = 'is-hidden';
                                        className.stop = '';
                                    } else {
                                        status = 'Parado';
                                        className.play = '';
                                        className.stop = 'is-hidden';
                                    }
                                    return (
                                        <tr key={index}>
                                            <td>{element.doc.entity}</td>
                                            <td>{element.doc.quantity}</td>
                                            <td className='entities-tags'>{element.doc.pages.map((page, i) => {
                                                return (
                                                    <span key={i} className="tag is-info">{page}</span>
                                                );
                                            })}</td>
                                            <td>
                                                <a onClick={event => { this.start(event, element.doc) }} style={{ marginRight: '5px' }} className={'button is-info is-small' + ' ' + className.play} title='Play'>
                                                    <span className='icon is-small'>
                                                        <i className="fa fa-play"></i>
                                                    </span>
                                                </a>
                                                <a onClick={event => { this.stop(event, element.doc) }} style={{ marginRight: '5px' }} className={'button is-info is-small' + ' ' + className.stop} title='Stop'>
                                                    <span className='icon is-small'>
                                                        <i className="fa fa-stop"></i>
                                                    </span>
                                                </a>
                                                <a onClick={event => { this.remove(event, element.doc) }} style={{ marginRight: '5px' }} className={'button is-info is-small'} title='Stop'>
                                                    <span className='icon is-small'>
                                                        <i className="fa fa-trash"></i>
                                                    </span>
                                                </a>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default Facebook;