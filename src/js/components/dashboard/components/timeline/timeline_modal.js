import React, { Component } from 'react';
import Correlation from './timeline_modal_correlation';
import TimeLine from './index';
import * as utils from '../../../../utils/utils';

const sentiments = {
  positive: 'Positivo',
  negative: 'Negativo',
  neutral: 'Neutro'
}

const source = {
    filecrawler: 'Arquivo',
    twitter: 'Twitter',
    facebook: 'Facebook',
    nodecrawler: 'Artigo',
    'connections': 'Connections'
  };

const ignore = {
  Organization: ['companies', 'campany', 'its', 'which', 'division', 'university', 'engineering compan', 'site'],
  Person: ['i', 'you', 'he', 'she', 'it', 'we', 'they', 'you', 'his', 'her', 'them', 'their', 'people', 'who', 'man', 'woman', 'whose', 'foreigners', 'staf', 'members', 'employee', 'workers', 'scientists', 'professor', 'teacher', 'manager', 'customer', 'chief executive', 'r$', 'researcher', 'co creator', 'reader', 'experts', 'engineer', 'executive director', 'user', 'users', 'employee', 'employees', 'player', 'players'],
  Company: []
};


class TimeLineModal extends Component {

  printSource(item) {
    switch (item.source) {
      case 'twitter': return <a href={item.link} target="_blank">{source[item.source]}</a>;
      case 'facebook': return source[item.source];
      case 'nodecrawler': return <a href={item.link} target="_blank">{utils.captalize(item.profile)}</a>;
      case 'filecrawler': return source[item.source];
      case 'connections': return <a href={item.link} target="_blank">{source[item.source]}</a>;
    }
  }

  filterCorrelations(relations) {
    let correlations = {
      Organization: [],
      Person: [],
      Company: []
    }

    if (relations.length) {
      // relations has arguments which has entities categorized, by other things, as Organization, Person and Company
      relations.forEach(relation => {
        if (relation.score >= 0.7) {
          relation.arguments.forEach(arg => {
            arg.entities.forEach(entity => {
              if (correlations[entity.type] && correlations[entity.type].indexOf(arg.text) === -1 && ignore[entity.type].indexOf(arg.text.toLowerCase()) === -1) {
                correlations[entity.type].push(arg.text);
              }
            });
          });
        }
      });
    }

    return correlations;
  }

  /**
   * 
   * @param {object} item 
   * @param {array} list 
   */
  createSimilarTimeLine(item, list) {
    let similars = [];
    let categories = item.categories.map(cat => cat.label);
    
    list.forEach(entry => {
        let isSimilar = false;

        if (entry._id !== item._id) {
            entry.categories.some(cat => {
                if (categories.indexOf(cat.label) > -1) {
                    isSimilar = true;
                }
                return isSimilar;
            });

            if (isSimilar) {
                similars.push(entry);
            }
        }
    });

    return similars;
  }

  render() {
    const item = this.props.item;
    const text = item.translations.portuguese.split('\n').map((p, i) => (<p key={i}>{p}</p>));
    const { Organization, Person, Company } = this.filterCorrelations(item.relations);
    const similars = this.createSimilarTimeLine(item, this.props.list)

    return (
      <div className="hero timeline-modal">
        <div className="hero-body is-paddingless">
          <div className="columns" style={{ height: '700px' }}>
            {/* main */}
            <div className="column main is-two-thirds">
              {item.title ? <h3 className="title is-4">{item.title}</h3> : ''}
              <p className="details is-clearfix">
                <span className="is-pulled-left">{this.printSource(item)}</span>
                <span className="is-pulled-right">{item.date}</span>
              </p>
              {text}
            </div>
            {/* sidebar */}
            <div className="column is-one-third timeline-sidebar">
              <div className="">
                <h3 className="title is-4">Correlações</h3>
                <Correlation title="Organizações" correlations={Organization} />
                <Correlation title="Pessoas" correlations={Person} />
                <Correlation title="Empresas" correlations={Company} />
              </div>

              <h3 className="title is-4">Sentimento</h3>
              <p>{sentiments[item.sentiment.label]}</p>

              {
                  similars.length ?
                  <div>
                    <h3 className="title is-4">Similares</h3>
                    <div className='widget-container' style={{ height: '400px' }}>
                        <TimeLine list={similars} />
                    </div>
                  </div> :
                  null
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TimeLineModal;