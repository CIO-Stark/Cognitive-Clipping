import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import utils from '../../utils/utils';

// Component
import form from '../shared/form';
import loading from '../../../images/loading.gif';
import * as Toast from '../shared/toast/toast_service';

// Data
import entity from '../../data/entity';
import articles from '../../data/articles';
import file from '../../data/file';

import Joyride from 'react-joyride';

class Filter extends Component {
    constructor(props) {
        super(props);
        this.articleProfileCounter = 0;
        this.socialMediaProfileCounter = 2;
        this.filesProfileCounter = 0;
        this.state = {
            date: [
                { date: '', placeholder: 'Data Inicial', value: 'dateStart' }, 
                { date: '', placeholder: 'Data Final', value: 'dateEnd' }
            ],
            sentiments: [
                { value: 'positive', name: 'Positivo', checked: true }, 
                { value: 'neutral', name: 'Neutro', checked: true }, 
                { value: 'negative', name: 'Negativo', checked: true }
            ],
            entities: [],
            contexts: [],
            articleProfile: { value: 'Artigos', checked: true },
            articles: [],
            socialMediaProfile: { value: 'Social Media', checked: true },
            socialMedia: [
                { value: 'facebook', name: 'Facebook', checked: true }, 
                { value: 'twitter', name: 'Twitter', checked: true },
                { value: 'connections', name: 'Connections', checked: false }
            ],
            // files: [],
            // filesProfile: { value: 'Arquivos', checked: true },
            exclude: [],
            advanced: false
        };

        this.dateValidation = this.dateValidation.bind(this);
        this.sentimentsValidation = this.sentimentsValidation.bind(this);
        this.entityValidation = this.entityValidation.bind(this);
        this.contextValidation = this.contextValidation.bind(this);
        this.articleValidation = this.articleValidation.bind(this);
        this.socialMediaValidation = this.socialMediaValidation.bind(this);
        this.createFiles = this.createFiles.bind(this);
        this.toggleFiles = this.toggleFiles.bind(this);
        this.toggleFile = this.toggleFile.bind(this);
        this.excludeValidation = this.excludeValidation.bind(this);
        this.runAnalyse = this.runAnalyse.bind(this);
        this.reloadData = this.reloadData.bind(this);
        this.advancedFilterChange = this.advancedFilterChange.bind(this);
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            date: newProps.data.date,
            sentiments: newProps.data.sentiments,
            entities: newProps.data.entities,
            contexts: newProps.data.contexts,
            articleProfile: newProps.data.articleProfile,
            articles: newProps.data.articles,
            socialMediaProfile: newProps.data.socialMediaProfile,
            socialMedia: newProps.data.socialMedia,
            files: newProps.data.files,
            filesProfile: newProps.data.filesProfile,
            exclude: newProps.data.exclude
        })
    }

    componentDidMount() {

        if (this.props.data !== undefined) {
            this.setState({
                date: this.props.data.date,
                sentiments: this.props.data.sentiments,
                entities: this.props.data.entities,
                contexts: this.props.data.contexts,
                articleProfile: this.props.data.articleProfile,
                articles: this.props.data.articles,
                socialMediaProfile: this.props.data.socialMediaProfile,
                socialMedia: this.props.data.socialMedia,
                files: this.props.data.files,
                filesProfile: this.props.data.filesProfile,
                exclude: this.props.data.exclude
            })
        } else {
            entity.get().then(response => {
                this.setState({ entities: response });
            }).catch(error => {
                console.error(error);
                Toast.open('Erro ao carregar a lista de entidades. Tente mais tarde.', 'danger');
            });

            articles.getProfile().then(response => {
                response = response.map((element) => {
                    return {
                        value: utils.captalize(element.name),
                        checked: true
                    };
                });

                this.setState({ articles: response }, function () {
                    this.articleProfileCounter = this.state.articles.length;
                });
            }).catch(error => {
                console.error(error);
                Toast.open('Erro ao carregar a lista de fontes de artigos. Tente mais tarde.', 'danger');
            });
        //get files
            file.get().then(response => {
                this.setState({ files: response });
            }).catch(error => {
                console.error(error);
                Toast.open('Erro ao carregar a lista de arquivos. Tente mais tarde.', 'danger');
            });
        }
    }

    createDate() {
        let that = this;
        return (
            this.state.date.map((date, index) => {
                return (
                    <div className='column' key={index}>
                        <form.Datepicker index={index} placeholder={date.placeholder} start={date.date} onChange={that.dateValidation} />
                    </div>
                )
            })
        )
    }

    dateValidation(date, index) {
        let stateDate = this.state.date;
        let that = this;
        stateDate[index].date = date;
        this.setState({ date: stateDate });
    }

    createSentiments() {
        let that = this;
        return (
            <div className='columns'>
                {
                    this.state.sentiments.map((sentiment, index) => {
                        return (
                            <div className='column' key={index}>
                                <form.SentimentCheckbox label={sentiment.name} checked={sentiment.checked} sentiment={sentiment.value} onChange={that.sentimentsValidation} />
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    sentimentsValidation(label) {
        let that = this;
        this.setState({
            sentiments: this.state.sentiments.map((sentiment, index) => {
                if (sentiment.name.indexOf(label) !== -1) {
                    sentiment.checked = !sentiment.checked;
                    return sentiment
                } else {
                    return sentiment
                }
            })
        })
    }

    createEntity() {
        let that = this;
        return (
            <ul>
                {this.state.entities.map((entity, index) => {
                    return (
                        <li key={index}>
                            <form.Checkbox index={index} checked={entity.checked} label={entity.value} value={entity.value} onChange={that.entityValidation} />
                        </li>
                    )
                })}
            </ul>
        )
    }

    entityValidation(event) {
        let that = this;
        let index = event.target.getAttribute('data-index');
        let entities = this.state.entities;
        entities[index].checked = !entities[index].checked;
        this.setState({ entities: entities }, function () {
            that.setState({ contexts: 'loader' });
            let selectedEntities = []
            that.state.entities.forEach((entity, index) => {
                if (entity.checked) {
                    selectedEntities.push(entity.value);
                }
            })
            entity.getContext(selectedEntities).then(response => {
                var that = this;
                this.setState({ contexts: response }, function () {
                    
                });
            }).catch()
        });
    }

    createContext() {
        let that = this;
        if (this.state.contexts === 'loader') {
            return (
                <div className='has-text-centered'>
                    <img src={loading} height='30px' width='30px' />
                </div>
            )
        }
        if (this.state.contexts.length === 0) {
            return (
                <p>Selecione, ao menos, uma entidade para exibir os contextos.</p>
            )
        }
        return (
            <ul>
                {this.state.contexts.map((itemList, index) => {
                    return itemList.map((context, internalIndex) => {
                        if (internalIndex === 0) {
                            return (
                                <li key={internalIndex}>
                                    <span>{context}</span>
                                </li>
                            );
                        } else {
                            return (
                                <li key={internalIndex}>
                                    <div className="radio">
                                        <label>
                                            <form.Checkbox internalIndex={internalIndex} index={index} checked={context.checked} label={context.value} value={context.value} onChange={that.contextValidation} />
                                        </label>
                                    </div>
                                </li>
                            );
                        }
                    });
                })}
            </ul>
        )
    }

    contextValidation(event) {
        let that = this;
        let index = event.target.getAttribute('data-index');
        let internalIndex = event.target.getAttribute('data-internal-index');
        let contexts = this.state.contexts;
        contexts[index][internalIndex].checked = !contexts[index][internalIndex].checked;
        this.setState({ contexts: contexts }, function () {
        });
    }

    createArticles() {
        let that = this;
        return (
            <div>
                <form.Checkbox label={this.state.articleProfile.value} value={this.state.articleProfile.value} checked={this.state.articleProfile.checked} onChange={that.articleValidation} />
                <ul>
                    {
                        this.state.articles.map((article, index) => {
                            return (
                                <li key={index}>
                                    <div className="radio">
                                        <label>
                                            <form.Checkbox index={index} label={article.value} value={article.value} checked={article.checked} onChange={that.articleValidation} />
                                        </label>
                                    </div>
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        )
    }

    articleValidation(event) {
        let index = event.target.getAttribute('data-index');
        let articleProfile = this.state.articleProfile;
        if (index === null) {
            articleProfile.checked = !articleProfile.checked;
            this.setState({ articleProfile: articleProfile });
            if (this.articleProfileCounter === 0) {
                this.articleProfileCounter = this.state.articles.length;
            } else {
                this.articleProfileCounter = 0;
            };
            let checked = event.target.checked;
            this.setState({
                articles:
                this.state.articles.map((article, index) => {
                    return {
                        value: article.value,
                        checked: checked
                    }
                })
            });
        } else {
            if (!this.state.articleProfile.checked) {
                articleProfile.checked = !articleProfile.checked;
                this.setState({ articleProfile: articleProfile });
            }
            if (event.target.checked) {
                this.articleProfileCounter++
            } else {
                this.articleProfileCounter--
            }
            if (this.articleProfileCounter === 0) {
                articleProfile.checked = false;
                this.setState({ articleProfile: articleProfile });
            } else {
                articleProfile.checked = true;
                this.setState({ articleProfile: articleProfile });
            }
            let articles = this.state.articles;
            articles[index].checked = !articles[index].checked;
            this.setState({
                articles: articles
            })
        }
    }

    createSocialMedia() {
        let that = this;
        return (
            <div>
                <form.Checkbox label={this.state.socialMediaProfile.value} label={this.state.socialMediaProfile.value} checked={this.state.socialMediaProfile.checked} onChange={that.socialMediaValidation} />
                <ul>
                    {
                        this.state.socialMedia.map((socialMedia, index) => {
                            return (
                                <li key={index}>
                                    <div className="radio">
                                        <label>
                                            <form.Checkbox index={index} label={socialMedia.name} value={socialMedia.name} checked={socialMedia.checked} onChange={that.socialMediaValidation} />
                                        </label>
                                    </div>
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        )
    }

    socialMediaValidation(event) {
        let index = event.target.getAttribute('data-index');
        let socialMediaProfile = this.state.socialMediaProfile;
        if (index === null) {
            socialMediaProfile.checked = !socialMediaProfile.checked;
            this.setState({ socialMediaProfile: socialMediaProfile });
            if (this.socialMediaProfileCounter === 0) {
                this.socialMediaProfileCounter = this.state.socialMedia.length;
            } else {
                this.socialMediaProfileCounter = 0;
            };
            let checked = event.target.checked;
            this.setState({
                socialMedia:
                this.state.socialMedia.map((socialMedia, index) => {
                    return {
                        value: socialMedia.value,
                        name: socialMedia.name,
                        checked: checked
                    }
                })
            });
        } else {
            if (!this.state.socialMediaProfile.checked) {
                socialMediaProfile.checked = !socialMediaProfile.checked;
                this.setState({ socialMediaProfile: socialMediaProfile });
            }
            if (event.target.checked) {
                this.socialMediaProfileCounter++
            } else {
                this.socialMediaProfileCounter--
            }
            if (this.socialMediaProfileCounter === 0) {
                socialMediaProfile.checked = false;
                this.setState({ socialMediaProfile: socialMediaProfile });
            } else {
                socialMediaProfile.checked = true;
                this.setState({ socialMediaProfile: socialMediaProfile });
            }
            let socialMedia = this.state.socialMedia;
            socialMedia[index].checked = !socialMedia[index].checked;
            this.setState({
                socialMedia: socialMedia
            })
        }
    }

    createFiles() {
        let that = this;
        return (
            <div>
                <form.Checkbox label={that.state.filesProfile.value} value={that.state.filesProfile.value} checked={that.state.filesProfile.checked} onChange={that.toggleFiles} />
                {
                    Array.isArray(that.state.files) ?
                        <ul>
                        {
                            that.state.files.map((file, index) => {
                                return (
                                    <li key={index}>
                                        <form.Checkbox index={index} label={file.filename} value={file._id} checked={file.checked} onChange={that.toggleFile} />
                                    </li>
                                )
                            })
                        }
                        </ul> : null
                }
            </div>
        )
    }
    
    toggleFile(event){
        let index = event.target.getAttribute("data-index");
        let files = this.state.files;
        files[index].checked = !files[index].checked;
        this.setState({
            files: files
        });
    }

    toggleFiles(event){
        let currentProfile = this.state.filesProfile;
        currentProfile.checked = !currentProfile.checked;
        let currentFiles = this.state.files;
        let newFiles = [];
        currentFiles.forEach(function(entry){
            entry.checked = currentProfile.checked;
            newFiles.push(entry);
        });
        this.setState({
            filesProfile: currentProfile,
            files: newFiles
        });
    }

    createExclude() {
        return (
            <form.Input type='input' helper='Separe por vírgula cada termo a ser excluído.' onChange={this.excludeValidation} />
        )
    }

    excludeValidation(event) {
        let that = this;
        let excludeText = event.target.value.split(',');
        let excludeTextTrim = excludeText.map((text) => {
            return text.trim();
        })
        this.setState({ exclude: excludeTextTrim }, () => {
        });
    }

    reloadData() {
        this.props.newData(this.runAnalyse(), this.state);
    }

    createAnalyse() {
        if (this.props.data !== undefined) {
            return (
                <div>
                    <a className="button is-info is-medium float-right" style={{ marginLeft: '5px' }} onClick={this.reloadData}>Analisar</a>
                </div>
            )
        } else {
            return (
                <div>
                    <Link className="button is-info is-medium float-right" style={{ marginLeft: '5px' }} to={{ pathname: "/dashboard", state: { data: this.runAnalyse(), state: this.state } }}>Analisar</Link>
                </div>
            )
        }
    }

    advancedFilterChange() {

        let advanced = this.state.advanced;

        this.setState({ advanced: !advanced });

    }

    advancedFilter() {
        return (
            <div>
                <a className="button is-info is-medium float-right" style={{ marginLeft: '5px' }} onClick={this.advancedFilterChange}>Filtro Avançado</a>
            </div>
        )
    }

    runAnalyse() {
        let filter = {};

        // Date
        this.state.date.forEach(date => {
            if (date.value === 'dateStart') {
                filter.start = date.date;
            }
        });

        this.state.date.forEach(date => {
            if (date.value === 'dateEnd') {
                filter.end = date.date;
            }
        });

        //Sentiments
        filter.sentiments = {};

        this.state.sentiments.forEach((sentiment) => {
            filter.sentiments[sentiment.value] = sentiment.checked;
        });

        //Entities

        filter.entity = [];
        this.state.entities.forEach((entity) => {
            if (entity.checked) {
                filter.entity.push(entity.value);
            }
        });

        // Context
        filter.context = [];
        if (Array.isArray(this.state.contexts)) {
            this.state.contexts.forEach((contexts) => {
                contexts.forEach((context) => {
                    if (context.checked) {
                        filter.context.push(context.value);
                    }
                })
            });
        }


        // Sources

        filter.sources = {};

        filter.sources.nodecrawler = this.state.articleProfile.checked;
        filter.sources.filecrawler = this.state.filesProfile.checked;
        this.state.socialMedia.forEach((socialMedia) => {
            filter.sources[socialMedia.value] = socialMedia.checked;
        });

        // Articles

        filter.profiles = {};
        this.state.articles.forEach((article) => {
            filter.profiles[article.value.toLowerCase()] = article.checked;
        });

        // File
        filter.files = [];
        this.state.files.forEach((file) => {
            if (file.checked) {
                filter.files.push(file._id);
            }
        });
    
        // Exclude

        filter.exclude = this.state.exclude;

        filter.limit = 10;

        return filter;
    }

    render() {
        const columnSize = this.props.columnSize ? this.props.columnSize : 'is-half';
        const columnClasses = `column ${columnSize}`
        let advanced = this.state.advanced ? null : ' is-hidden';
        return (
            <div className="container">
                <div className='columns is-multiline'>
                    <div className={columnClasses + ' fixed-height'}>
                        <h4 className="title is-4 color-filter-blue">Entidade</h4>
                        {this.createEntity()}
                    </div>
                    <div className={columnClasses + ' fixed-height'}>
                        <h4 className="title is-4 color-filter-blue">Contexto</h4>
                        {this.createContext()}
                    </div>
                </div>
                <div className={advanced}>
                    <div className='columns is-multiline'>
                        <div className='column'>
                            <h4 className="title is-4 color-filter-blue">Sentimento</h4>
                            {this.createSentiments()}
                        </div>
                        <div className='column'>
                            <h4 className="title is-4 color-filter-blue">Excluir</h4>
                            {this.createExclude()}
                        </div>
                    </div>
                    <div className='columns is-multiline'>
                        <div className='column'>
                            <h4 className="title is-4 color-filter-blue">Período</h4>
                            <div className='columns'>
                                {this.createDate()}
                            </div>
                        </div>
                        <div className='column'>
                            <h4 className="title is-4 color-filter-blue">Fontes dos Dados</h4>
                            <div className='columns'>
                                <div className='column fixed-height'>
                                    {this.createArticles()}
                                </div>
                                <div className='column fixed-height'>
                                    {this.createSocialMedia()}
                                </div>
                                <div className='column fixed-height'>
                                    {this.createFiles()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='columns is-multiline'>
                    <div className={columnClasses}>
                    </div>
                    <div className={columnClasses}>
                        <div>
                            <h4 className="title is-4 color-filter-blue"></h4>
                            {this.createAnalyse()}
                        </div>
                        <div>
                            <h4 className="title is-4 color-filter-blue"></h4>
                            {this.advancedFilter()}
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

export default Filter;