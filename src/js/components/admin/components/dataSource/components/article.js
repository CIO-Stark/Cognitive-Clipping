import React, { Component } from 'react';

import article from '../../../../../data/articles';
import utils from '../../../../../utils/utils';
import * as Toast from '../../../../shared/toast/toast_service';

class Article extends Component {

    constructor(props) {
        super(props);
        this.state = {
            articleProfile: {},
            instances: []
        };

        this.updateInstances = this.updateInstances.bind(this);
    }

    updateInstances (instances) {
        let array = [];

        for (var key in instances) {
            if (instances[key]) {
                let element = instances[key];
                element.name = key;
                array.push(element);
            }
        }

        this.setState({ articleProfile: instances, instances: array });
    }

    componentDidMount() {
        article.status()
        .then(this.updateInstances)
        .catch(error => {
            console.error(error);
            Toast.open('Erro ao carregar a lista de websites. Tente mais tarde.', 'danger');
        });
    }

    crawlerStart(event, element) {

        article.start(element)
        .then(this.updateInstances)
        .catch(error => {
            console.error(error);
            Toast.open('Erro ao iniciar a coleta. Tente mais tarde.', 'danger');
        });

    }

    crawlerStop(event, element) {

        article.stop(element)
        .then(this.updateInstances)
        .catch(error => {
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
        let that = this;
        return (
            <div>
                <article className="message is-info">
                    <div className="message-header">
                        Info
                        <button className="delete" onClick={this.removeInfo}></button>
                    </div>
                    <div className="message-body">
                        <p>
                            A lista abaixo possui os domínios cadastrados para extração de artigos e notícias. Esse conteúdo é processado e seus insights são exibidos no dashboard do usuário de acordo com a busca realizada por ele.
                        </p>
                        <p>
                            Você pode parar e iniciar as buscas para cada domínio na coluna 'Ações'.
                        </p>
                    </div>
                </article>

                <div className='columns'>
                    <div className='column'>
                        <table className='table is-striped'>
                            <thead>
                                <tr>
                                    <th>Domínio</th>
                                    <th>Status da Coleta</th>
                                    <th>Artigos Coletados</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.instances.map((element, index) => {
                                    let status = undefined;
                                    let className = {
                                        play: undefined,
                                        stop: undefined
                                    }
                                    if (element.status) {
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
                                            <td>{utils.captalize(element.name)}</td>
                                            <td>{status}</td>
                                            <td>{element.crawled}</td>
                                            <td>
                                                <a onClick={event => { that.crawlerStart(event, element) }} className={'button is-info is-small' + ' ' + className.play} title='Play'>
                                                    <span className='icon is-small'>
                                                        <i className="fa fa-play"></i>
                                                    </span>
                                                </a>
                                                <a onClick={event => { that.crawlerStop(event, element) }} className={'button is-info is-small' + ' ' + className.stop} title='Stop'>
                                                    <span className='icon is-small'>
                                                        <i className="fa fa-stop"></i>
                                                    </span>
                                                </a>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        );
    }
}

export default Article;