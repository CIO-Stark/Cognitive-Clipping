import React, { Component } from 'react';
import WordCloud2 from '../../../../libs/wordcloud';
import form from '../../../shared/form';

const defaultOptions = {
    socialMedia: { name: 'Social Media', value: 'socialMedia' },
    articles: { name: 'Artigos', value: 'articles' },
    files: { name: 'Arquivos', value: 'files' },
    connections: { name: 'Connections', value: 'connections' }
};

class WordCloud extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: 'socialMedia',
            selectOptions: []
        };

        this.shouldUpdate = true;

        this.selectChange = this.selectChange.bind(this);
        this.paintSelectedWord = this.paintSelectedWord.bind(this);
        this.createWordCloud = this.createWordCloud.bind(this);
    }

    /**
     * Sort select options based on the length of each source array
     * @param {Object} data Object with each source array as property
     * @param {function} callback Function to be executed after state is updated with the new options
     */
    sortFilerOptions (data, callback) {
        let options = [];
        let sortedList = Object.keys(data).map(entry => ({ label: entry, len: this.props.data[entry].length }));
        let length = sortedList.length;

        sortedList.sort((a,b) => {
            return a.len - b.len;
        });

        for (let i = 0; i < length; i++) {
            let item = sortedList.pop();
            if (item.len) {
                options.push(defaultOptions[item.label]);
            }
        }
        
        this.setState({ selectOptions: options, selected: options[0].value }, callback);
    }

    componentDidMount () {
        this.sortFilerOptions(this.props.data, () => {
            this.createWordCloud(this.props.data[this.state.selected]);
        });

        this.container.addEventListener('click', this.paintSelectedWord);
        window.addEventListener('resize', this.createWordCloud);
    }

    componentWillUnmount () {
        this.container = null;
        window.removeEventListener('resize', this.createWordCloud);
    }

    selectChange (event) {
        let value = event.target.value;

        this.setState({ selected: value });
        this.createWordCloud(this.props.data[value]);
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.updatesOnWordcloud > this.props.updatesOnWordcloud) {
            this.shouldUpdate = true;
            this.createWordCloud(nextProps.data[this.state.selected]);
        }
        this.shouldUpdate = false;
    }

    shouldComponentUpdate () {
        return this.shouldUpdate;
    }

    paintSelectedWord (event) {
        if (event.target.classList.contains('wordcloud-item')) {
            let selected = this.container.querySelector('.wordcloud-item.selected');
            
            if (selected) {
                selected.classList.remove('selected');

                if (selected.innerHTML !== event.target.innerHTML) {
                    event.target.classList.add('selected');
                }
            } else {
                event.target.classList.add('selected');
            }
        }
    }

    createWordCloud (items) {
        let element = this.container;
        let list = Array.isArray(items) ? items : this.props.data[this.state.selected];

        if (element) {
            Array.prototype.forEach.call(element.childNodes, node => {
                element.removeChild(node);
            });
        }

        let correlate = this.props.correlate;

        let options = {
            list: list,
            color: null,
            backgroundColor: '',
            classes: 'clickable wordcloud-item',
            minRotation: '0',
            maxRotation: '0',
            clearCanvas: true,
            click: function (word) { 
                correlate(word, 'trends');
            }
        };

        WordCloud2(element, options);
    }

    render() {
        const select = this.state.selectOptions && this.state.selectOptions.length > 1 ? <form.Select options={this.state.selectOptions} onChange={this.selectChange} /> : null;
        
        return (
            <div className='widget-content widgetContentWordCloud'>
                <div className='widget-header'>
                    <h5 className="title is-5">
                        WordCloud
                        { select }
                    </h5>
                </div>
                <div style={{ width: '100%', height: 'calc(100% - 51px)' }}>
                    <div id='wordcloud' style={{ width: '100%', height: '100%' }} ref={element => this.container = element}></div>
                </div>
            </div>
        );
    }
}

export default WordCloud;