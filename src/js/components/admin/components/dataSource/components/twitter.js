import React, { Component } from 'react';

import entitiesData from '../../../../../data/entity';
import twitterData from '../../../../../data/twitter';
import * as Toast from '../../../../shared/toast/toast_service';
class Twitter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            crawling: [],
            languege: [
                {
                    code: "",
                    status: "production",
                    name: "Todas"
                },
                {
                    code: "fr",
                    status: "production",
                    name: "French"
                },
                {
                    code: "en",
                    status: "production",
                    name: "English"
                },
                {
                    code: "ar",
                    status: "production",
                    name: "Arabic"
                },
                {
                    code: "ja",
                    status: "production",
                    name: "Japanese"
                },
                {
                    code: "es",
                    status: "production",
                    name: "Spanish"
                },
                {
                    code: "de",
                    status: "production",
                    name: "German"
                },
                {
                    code: "it",
                    status: "production",
                    name: "Italian"
                },
                {
                    code: "id",
                    status: "production",
                    name: "Indonesian"
                },
                {
                    code: "pt",
                    status: "production",
                    name: "Portuguese"
                },
                {
                    code: "ko",
                    status: "production",
                    name: "Korean"
                },
                {
                    code: "tr",
                    status: "production",
                    name: "Turkish"
                },
                {
                    code: "ru",
                    status: "production",
                    name: "Russian"
                },
                {
                    code: "nl",
                    status: "production",
                    name: "Dutch"
                },
                {
                    code: "fil",
                    status: "production",
                    name: "Filipino"
                },
                {
                    code: "msa",
                    status: "production",
                    name: "Malay"
                },
                {
                    code: "zh-tw",
                    status: "production",
                    name: "Traditional Chinese"
                },
                {
                    code: "zh-cn",
                    status: "production",
                    name: "Simplified Chinese"
                },
                {
                    code: "hi",
                    status: "production",
                    name: "Hindi"
                },
                {
                    code: "no",
                    status: "production",
                    name: "Norwegian"
                },
                {
                    code: "sv",
                    status: "production",
                    name: "Swedish"
                },
                {
                    code: "fi",
                    status: "production",
                    name: "Finnish"
                },
                {
                    code: "da",
                    status: "production",
                    name: "Danish"
                },
                {
                    code: "pl",
                    status: "production",
                    name: "Polish"
                },
                {
                    code: "hu",
                    status: "production",
                    name: "Hungarian"
                },
                {
                    code: "fa",
                    status: "production",
                    name: "Farsi"
                },
                {
                    code: "he",
                    status: "production",
                    name: "Hebrew"
                },
                {
                    code: "ur",
                    status: "production",
                    name: "Urdu"
                },
                {
                    code: "th",
                    status: "production",
                    name: "Thai"
                },
                {
                    code: "en-gb",
                    status: "production",
                    name: "English UK"
                }
            ],
            entitySelected: '',
            langSelected: '',
            quantitySelected: 100,
            profileSelected: ''
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
        twitterData.load()
            .then(response => {
                this.setState({
                    crawling: response.data.rows.map((element, index) => {
                        return element;
                    })
                });
            })
            .catch(error => {
                console.error(error);
                Toast.open('Erro ao carrega a lista de entidades. Tente mais tarde.', 'danger');
            });
    }

    handleChange(event) {
        const target = event.target.id;
        const value = event.target.value;
        this.setState({ [target]: value });
    }

    create() {
        let entity = {
            entity: this.state.entitySelected,
            quantity: this.state.quantitySelected,
            lang: this.state.langSelected,
            profile: this.state.profileSelected
        }

        let that = this

        twitterData.create(entity)
            .then(response => {
                that.entitiesLoad();
                this.setState({
                    entitySelected: '',
                    langSelected: '',
                    quantitySelected: 100,
                    profileSelected: ''
                })
            }).catch(error => {
                console.error(error);
                Toast.open('Erro ao criar o item. Tente mais tarde.', 'danger');
            });
    }

    remove(event, entity) {
        entity = {
            _id: entity._id,
            _rev: entity._rev
        }

        let that = this

        twitterData.remove(entity)
        .then(response => {
            that.entitiesLoad();
        }).catch(error => {
            console.error(error);
            Toast.open('Erro ao remover o item. Tente mais tarde.', 'danger');
        });
    }

    start(event, entity) {
        entity = {
            _id: entity._id
        }

        let that = this

        twitterData.start(entity)
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

        twitterData.stop(entity)
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
                        <p>As buscas no twitter devem ser realizadas baseadas em entidades.</p>
                        <p>Você pode criar buscas personalizadas para cada entidade cadastrada. Para isso, selecione uma entidade, a lingua desejada, a quantidade de tweets que deseja e a data de início da busca no formulário abaixo. Se desejar, pode focar a busca em um único perfil, preenchendo o campo 'Perfil Alvo'.</p>
                        <p>Depois de criada, você deve dar inicio a busca selecionando a opção 'Iniciar Coleta', botão play, na coluna 'Ações'. Você também pode parar e deletar uma busca na mesma coluna.</p>
                        <p>Os dados começam a ser gravados após 15 segundos da iniciação da coleta.</p>
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
                            <label className="label">Língua</label>
                            <p className="control">
                                <span className="select is-fullwidth">
                                    <select id='langSelected' value={this.state.langSelected} onChange={this.handleChange}>
                                        {this.state.languege.map((element, index) => {
                                            return (
                                                <option key={index} value={element.code} >{element.name}</option>
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
                            <label className="label">Perfil Alvo</label>
                            <p className="control">
                                <input id='profileSelected' className="input" type="text" placeholder="" value={this.state.profileSelected} onChange={this.handleChange} />
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
                                    <th>Perfil</th>
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
                                            <td>{element.doc.lang}</td>
                                            <td>{element.doc.profile}</td>
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
                                                <a onClick={event => { this.remove(event, element.doc) }} style={{ marginRight: '5px' }} className={'button is-info is-small'} title='Delete'>
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

export default Twitter;