import React from 'react';

//components
import Banner from './component/banner';
import Filter from '../shared/filter';

import JOYRIDE_STEPS from './constants';

import Joyride from 'react-joyride';

import entity from '../../data/entity';
import moment from 'moment';

const defaultFilterOptions = {
    "start": "",
    "end": "",
    "sentiments": {
      "positive": true,
      "neutral": true,
      "negative": true
    },
    "entity": [],
    "sources": {
      "nodecrawler": true,
      "filecrawler": true,
      "facebook": true,
      "twitter": true,
      "connections": false
    },
    "profiles": {
      "exame": true,
      "folha": true,
      "globo": true,
      "istoe": true,
      "olhardigital": true,
      "tecmundo": true,
      "uol": true
    },
    "exclude": [],
    "limit": 10
};

export default class Welcome extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        infoRun: false,
        searchOptions: defaultFilterOptions,
        entities: null
    };

    this.infoStart = this.infoStart.bind(this);
    this.infoEnd = this.infoEnd.bind(this);
  }

  componentDidMount () {
      this.props.subscribe('info', this.infoStart);
      
      // get entities
      entity.get().then(response => {
        if (response.length) {
            this.setState({ entities: response });
        } else {
            Toast.open('Erro ao carregar a lista de entidades. Tente mais tarde.', 'danger');
        }
      }).catch(error => {
          console.error(error);
          Toast.open('Erro ao carregar a lista de entidades. Tente mais tarde.', 'danger');
      });
  }

  runAnalyse (entity) {
    let data = this.state.searchOptions;
    data.entity.push(entity.value);
    data.start = entity.start || moment().subtract(1, 'years').format('YYYY-MM-DD');
    data.end = entity.end || moment().format('YYYY-MM-DD');

    this.props.history.push('/dashboard', { data: data, state: this.state.searchOptions });
  }

  infoStart() {
    this.setState({ infoRun: true });
  }


  infoEnd(event) {
    if (event.type === 'finished') {
      this.setState({ infoRun: false }, () => {
        this.joyride.reset();
      });
    }
  }

  render() {
    const entities = this.state.entities;

    return (
      // <div>{html}</div>
      <section id="welcome" className="hero is-fullheight bg_blue">
        <div className="hero-body">
          <div className="container main">
            <Banner />
            <hr className='hr-welcome' />
            {/*<Filter />*/}

            <div className="columns is-multiline">
                {
                    entities && entities.length ?
                    entities.map((entry, index) => (
                        <div className="column is-3" key={index}>
                            <a className="button is-fullwidth is-primary" onClick={() => this.runAnalyse(entry)}>{ entry.value }</a>
                        </div>
                    )) : null
                }
            </div>

          </div>
        </div>
        <Joyride
          ref={c => (this.joyride = c)}
          type={'continuous'}
          scrollToSteps={true}
          showStepsProgress={true}
          steps={JOYRIDE_STEPS}
          run={this.state.infoRun} // or some other boolean for when you want to start it
          debug={false}
          showSkipButton={true}
          locale={{ back: 'Voltar', close: 'Fechar', last: 'Fim', next: 'Proximo', skip: 'Pular' }}
          callback={this.infoEnd} />
      </section>
    )
  }

}