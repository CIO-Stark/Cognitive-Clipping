import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import utils from '../../utils/utils';

// Component
import form from '../shared/form';
import Loading from './loading';

// Data
import dbpedia from '../../data/dbpedia';
import entity from '../../data/entity';


const NO_RESULT = 'Não foi possível encontrar a descrição desta pesquisa. Por favor tente com outra entidade.';

class DbpediaMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            query: { type: '', value: '' },
            searchResult: {},
            isLoading: true
        };
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.dbpediaQuery.value !== this.state.query.value) {
            this.setState({ query: this.props.dbpediaQuery, searchResult: {}, isLoading: true });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.dbpediaQuery.value !== prevState.query.value) {
            dbpedia(prevProps.dbpediaQuery.value, prevProps.dbpediaQuery.type)
            .then(response => {
                console.log('REsponse: ',response);
                this.setState({ searchResult: response, isLoading: false });
            })
            .catch(error => {
                console.log('Dbpedia error: ', error);
                this.setState({ searchResult: {}, isLoading: false });
            });
        }
    }

    render() {
        const { imageURL, description } = this.state.searchResult;
        const isLoading = this.state.isLoading;
        let content = null;

        if (!isLoading) {
            if (description && description.pt) {
                content = description.pt;
            } else if (!description || !description.pt) {
                content = NO_RESULT;
            }
        }

        return (
            <div className="container">
                <div className='columns is-multiline'>
                    <div className='column is-12'>
                        <h4 className="title is-4 color-filter-blue">{ this.props.dbpediaQuery.value }</h4>
                    </div>

                    <div className='column is-half is-offset-one-quarter'>
                        { imageURL ? <img src={imageURL}/> : null }
                    </div>

                    <div className='column is-12 should-scroll-x'>
                        { content }
                    </div>
                </div>
            </div>
        );
    }
}

export default DbpediaMenu;