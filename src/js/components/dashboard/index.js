import React, { Component } from 'react';
import ReactGridLayout, { WidthProvider } from 'react-grid-layout';
import { LAYOUT, JOY_RIDE_STEPS, FILTER_STATE, WIDGET as WIDGET_DEFAULT } from './constants';

const moment = require('moment');

import Joyride from 'react-joyride';

import loading from '../../../images/loading.gif';

import Widget from './components/widget';
import TimeLineTabs from './components/timeline_tabs';
import WordCloud from './components/wordcloud/';
import Insights from './components/insights/';
import SentimentBySource from './components/sentiment_by_source/';
import SentimentTimeline from './components/sentiment_timeline/';
import NetworkChart from './components/network_chart/'
import Filter from '../shared/filter';
import WidgetMenu from './components/widget_menu';
import DbpediaMenu from '../shared/dbpediaMenu';
import LocalStorage from '../../libs/local_storage';
import { indexOfObject } from '../../utils/utils';
import * as Toast from './../shared/toast/toast_service';

import analyse from '../../data/analyse';
import dataProcess from './data_processors/';
import * as utils from '../../utils/utils';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// import * as Data from '../../data/data';
// import mock from '../../mock.json';

const charts = {
  time_line: TimeLineTabs,
  insights: Insights,
  trends: WordCloud,
  channel: SentimentBySource,
  report: SentimentTimeline,
  correlation: NetworkChart
};

const GridLayout = WidthProvider(ReactGridLayout);

export default class Dashboard extends Component {

  constructor(props) {
    super(props);

    this.dataBackup = null;

    this.state = {
      layout: [],
      isDraggable: true, // start/stop widget from been dragged,
      isSideMenuOpen: false,
      isDbpediaMenuOpen: false, // holds the dbpedia data
      isWidgetMenuOpen: false,
      changingLayout: false,
      data: undefined,
      correlation: undefined,
      infoRun: false,
      loader: true,
      time_line: [],
      theme: "dark",
      dbpediaQuery: { type: '', value: '' },
      selectedWidgetItem: {},
      updatesOnTimeline: 0,
      updatesOnWordcloud: 0,
      updatesOnCorrelation: 0,
      date: [{ date: '', placeholder: 'Data Inicial', value: 'dateStart' }, { date: '', placeholder: 'Data Final', value: 'dateEnd' }],
      filterState: FILTER_STATE,
      filterURL: {}
    };

    this.closeMenus = this.closeMenus.bind(this);
    this.toggleSideMenu = this.toggleSideMenu.bind(this);
    this.toggleWidgetMenu = this.toggleWidgetMenu.bind(this);
    this.onWidgetMenuItemSelect = this.onWidgetMenuItemSelect.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.infoStart = this.infoStart.bind(this);
    this.infoEnd = this.infoEnd.bind(this);
    this.newData = this.newData.bind(this);
    this.switchTheme = this.switchTheme.bind(this);
    this.correlateData = this.correlateData.bind(this);
    this.selectPropsToChart = this.selectPropsToChart.bind(this);
    this.nodeClicked = this.nodeClicked.bind(this);
    this.filterData = this.filterData.bind(this);
    this.addUrlFilter = this.addUrlFilter.bind(this);
    this.urlValidation = this.urlValidation.bind(this);
    this.shareLink = this.shareLink.bind(this);
    this.onDateSliderChange = this.onDateSliderChange.bind(this);
    this.blockDraggableOnTablet = this.blockDraggableOnTablet.bind(this);
  }

  addUrlFilter(filter, state) {
    window.history.pushState("", "", [window.location.href]);
    window.history.pushState("", "", [window.location.href + "?filter=" + JSON.stringify(filter)]);
  }

  urlValidation() {
    let id;
    let query = window.location.search.substring(1); //pega os atributos da tabela e armazena na variavel parameters
    let keyValues = query.split(/&/);
    let value = [];
    for (let i = 0; i < keyValues.length; i++) {
      let keyValuePairs = keyValues[i].split(/=/);
      var key = keyValuePairs[0];
      value.push(keyValuePairs[1]);
    }
    if (value[0] === undefined || value[1] === undefined) {
      return {}
    }
    return { filter: JSON.parse(decodeURI(value[0])), state: JSON.parse(decodeURI(value[1])) }
  }

  componentDidMount() {
    let that = this;
    let filter;
    let state;
    let validation = this.urlValidation();
    if (!validation.filter) {
      filter = this.props.location.state.data;
      state = this.props.location.state.state
      //this.addUrlFilter(filter, state);
      this.setState({ filterState: state, filterURL: filter });
    } else {
      filter = validation.filter
      this.setState({ filterState: validation.state, filterURL: validation.filter });
    }

    if (filter.entity.length > 0) {

      let promises = [];

      promises.push(analyse.correlation(filter));
      promises.push(analyse.analyse(filter));

      Promise.all(promises).then(response => {

        if (!response[1].data.length) {
            Toast.open('Nenhum dado encontrado.');
            this.props.history.push('/');
        } else  {
            // subscribe actions to menu buttons
            that.props.subscribe('color', that.switchTheme);
            that.props.subscribe('menu', that.toggleSideMenu);
            that.props.subscribe('widget', that.toggleWidgetMenu);
            that.props.subscribe('info', that.infoStart);
            that.props.subscribe('link', that.shareLink);

            // get layout
            let layout = LocalStorage.getItem('dashboard-layout');

            if (!layout) {
                layout = [];
                for (var w in WIDGET_DEFAULT) {
                    layout.push(WIDGET_DEFAULT[w]);
                }
            }

            let data = dataProcess(response[1].data, layout.map(l => l.i), true);
            data.raw = response[1].data;

            that.setState({ correlation: response[0], data }, () => {
            this.setState({ layout, loader: false });
            });
        }

      });

        this.blockDraggableOnTablet();
        window.addEventListener('resize', this.blockDraggableOnTablet);
    } else {
        Toast.open('Nenhum dado para essa analise', 'warning');
        this.props.history.push('/');
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.blockDraggableOnTablet);
  }

  blockDraggableOnTablet () {
      let shouldDrag = window.innerWidth <= 1007 ? true : false;
      this.setState({ isDraggable: shouldDrag });
  }

  shareLink() {
    let copyToClipboard = (url) => {
      var aux = document.createElement("input");//create aux
      document.getElementsByTagName("body")[0].appendChild(aux);//append it to body
      aux.value = url;//set its value equal to url
      aux.select();//set text selection on aux
      document.execCommand("copy");//copy selection to clipboard
      aux.parentNode.removeChild(aux);//remove aux
      Toast.open('Link Copiado', 'success');
    };
    copyToClipboard(window.location.href)
  }

  /**
   * 
   * @param {any} triggered Data from the clicked element in the widget. Can be a string, number or an object
   * @param {string} from Widget id
   */
  correlateData(triggered, from) {
    let data = this.state.data;

    if (from === 'trends') { // if wordcloud
      let timelineUpdates = this.state.updatesOnTimeline;
      let correlationUpdates = this.state.updatesOnCorrelation;
      data.time_line = triggered.data;

      this.setState({
        data: data,
        updatesOnTimeline: ++timelineUpdates,
        updatesOnCorrelation: ++correlationUpdates,
        selectedWidgetItem: { "selectedItems": data.time_line, "keyword": triggered.word, "from": "trends" }
      });
    } else if (from === 'timeline') {
      let wordcloudUpdates = this.state.updatesOnWordcloud;
      let correlationUpdates = this.state.updatesOnCorrelation;
      data.trends = dataProcess([triggered], ['trends']).trends;

      this.setState({
        data: data,
        updatesOnWordcloud: ++wordcloudUpdates,
        updatesOnCorrelation: ++correlationUpdates,
        selectedWidgetItem: { "selectedItems": [triggered], "from": "time_line" }
      });

    } else if (from === 'correlation') {
      console.log('Label: ', triggered.label, ' - Group: ', triggered.group, ' - Id: ', triggered.id, ' - Level: ', triggered.level);

      // Level 0: the entiies searched
      if (triggered.level === 0) { //

        // level 1: facebook/twitter/articles
      } else if (triggered.level === 1) {
        let index = indexOfObject(this.state.data.raw, triggered.id, '_id');

        if (index > -1) {
          let content = [this.state.data.raw[index]];
          let timelineUpdates = this.state.updatesOnTimeline;
          data.time_line = content;

          this.setState({ data, updatesOnTimeline: ++timelineUpdates });
        } else {
          let group = triggered.group; // apply the filter based in the triggered data group
          let ids = triggered.id.split('_'); // 1: entity type - 2: entity text 

          // From correlation graph, relations are built like:
          // relations[].type|realations[].arguments[].entities[type&text]
          // Looking for all docs that has the same relation
          let filter = {
            keywords: entry => (
              entry.keywords && indexOfObject(entry.keywords, triggered.label, 'label') > -1
            ),
            relations: entry => {
              if (entry.relations) {
                let foundIt = false;

                entry.relations.forEach(relation => {
                  relation.arguments.some(argument => {
                    if (argument.entities[0].type === ids[1] && argument.entities[0].text === ids[2]) {
                      foundIt = true;
                      return true;
                    }
                  });
                });

                return foundIt;
              }
            }
          };

          let filtered = this.state.data.raw.filter(filter[group]);
          let timelineUpdates = this.state.updatesOnTimeline;

          data.time_line = filtered;
          this.setState({ data, updatesOnTimeline: ++timelineUpdates });
        }
        // Level 2 and above: keywords and relations
      } else {
        let group = triggered.group; // apply the filter based in the triggered data group
        let ids = triggered.id.split('_'); // 1: entity type - 2: entity text 

        // From correlation graph, relations are built like:
        // relations[].type|realations[].arguments[].entities[type&text]
        // Looking for all docs that has the same relation
        let filter = {
          keywords: entry => (
            entry.keywords && indexOfObject(entry.keywords, triggered.label, 'text') > -1
          ),
          relations: entry => {
            if (entry.relations) {
              let foundIt = false;

              entry.relations.forEach(relation => {
                relation.arguments.some(argument => {
                  if (argument.entities[0].type === ids[1] && argument.entities[0].text === ids[2]) {
                    foundIt = true;
                    return true;
                  }
                });
              });

              return foundIt;
            }
          },
          entities: entity => {
              let foundIt = false;
              
              if (entity.entities && entity.entities.length) {
                entity.entities.some(entry => {
                    foundIt = entry.text === triggered.label;
                    return foundIt;
                });
              }

              return foundIt;
          }
        };

        let filtered = this.state.data.raw.filter(filter[group] || filter.entities);
        let timelineUpdates = this.state.updatesOnTimeline;

        data.time_line = filtered;
        this.setState({ data, updatesOnTimeline: ++timelineUpdates });
      }
    }
  }

  switchTheme() {
    let theme = this.state.theme === 'default' ? 'dark' : 'default';
    this.setState({ theme });
  }

  infoStart() {
    this.setState({ infoRun: true, isSideMenuOpen: false, isWidgetMenuOpen: false });
  }

  infoEnd(event) {
    if (event.type === 'finished') {
      this.setState({ infoRun: false }, () => {
        this.joyride.reset();
      });
    }

  }

  // Menu 

  closeMenus(event) {
    this.setState({ isSideMenuOpen: false, isWidgetMenuOpen: false, isDbpediaMenuOpen: false });
  }

  toggleSideMenu(event) {
    event.preventDefault();
    if (this.state.isDbpediaMenuOpen)
      this.setState({ isSideMenuOpen: false, isWidgetMenuOpen: false, isDbpediaMenuOpen: false });

    else this.setState({ isSideMenuOpen: !this.state.isSideMenuOpen, isWidgetMenuOpen: false });
  }

  toggleWidgetMenu(event) {
    event.preventDefault();
    this.setState({ isWidgetMenuOpen: !this.state.isWidgetMenuOpen, isSideMenuOpen: false, isDbpediaMenuOpen: false });
  }

  onWidgetMenuItemSelect(widget) {
    let self = this;

    self.setState({ changingLayout: true }, () => {
      let layout = self.state.layout;
      let index = layout.indexOf(widget);

      layout[index].active = !layout[index].active;

      self.setState({ layout, changingLayout: false });
      LocalStorage.setItem('dashboard-layout', layout);
    });
  }

  // Layout

  onLayoutChange(newLayout) {
    let self = this;

    setTimeout(() => {
      let backup = self.state.layout;

      newLayout.forEach(widget => {
        let index = indexOfObject(backup, widget.i, 'i');

        for (let prop in backup[index]) {
          if (widget[prop] !== undefined) {
            backup[index][prop] = widget[prop];
          }
        }
      });

      LocalStorage.setItem('dashboard-layout', backup);
    });
  }

  filterData(dates, list) {

    let newList = [];

    list.forEach(item => {
      if (moment(item.date).isBetween(dates[0].date, dates[1].date)) {
        newList.push(item);
      }
    })

    let data = this.state.data;
    let updatesOnTimeline = this.state.updatesOnTimeline;
    data.time_line = newList;
    this.setState({ data, updatesOnTimeline: ++updatesOnTimeline });

  }

  newData(filter, state) {
    window.location.href = window.location.origin + window.location.pathname + "?filter=" + JSON.stringify(filter) + "&" + "state=" + JSON.stringify(state);
  }

  /**
   * handle correlation graphic node click events
   * @param {*} event
   */
  nodeClicked(event) {
    console.log("nodeclicked event", event, event.data.node.group, event.data.node.group);
    try {
      if (event.data.node.group && event.data.node.group === 'person') {
        this.setState({ dbpediaQuery: { type: 'person', value: event.data.node.label } });
        this.setState({ isDbpediaMenuOpen: true });
      } else if (event.data.node.group && event.data.node.group === 'organization') { //organization needs only the label
          this.setState({ dbpediaQuery: { value: event.data.node.label } });
          this.setState({ isDbpediaMenuOpen: true });
      }
      this.correlateData(event.data.node, 'correlation');
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Filter data based on date slider changes
   * @param {array} values array with 2 positions, start and end dates
   */
  onDateSliderChange (values) {
    let oldData = this.state.data;
    let filteredData = null;
    let newData = null;

    filteredData = oldData.raw.filter(entry => {
        let date = utils.getStringDateMilliseconds(entry.date);
        return date >= values[0] && date <= values[1];
    });

    newData = dataProcess(filteredData, this.state.layout.map(l => l.i))
    newData.raw = oldData.raw;
    newData.date = oldData.date;
    
    this.setState({ data: newData });
  }

  /**
   * Return an object with the properties related to the given chart id
   * @param {number} id Chart id
   */
  selectPropsToChart(id) {
    switch (id) {
      case 'correlation':
        return {
          data: this.state.correlation,
          correlate: this.correlateData,
          node: this.nodeClicked,
          selectedWidgetItem: this.state.selectedWidgetItem,
          updatesOnCorrelation: this.state.updatesOnCorrelation
        };
      case 'time_line':
        return {
            data: this.state.data[id],
            date: this.state.data.date,
            correlate: this.correlateData,
            dateValidation: this.onDateSliderChange, // prop should e called onDateSliderChange. But some kind of bug isn't updating it when changed
            updatesOnTimeline: this.state.updatesOnTimeline
        };
      case 'trends':
        return { data: this.state.data[id], correlate: this.correlateData, updatesOnWordcloud: this.state.updatesOnWordcloud };
      default: {
        return { data: this.state.data[id] };
      }
    }
  }

  render() {
    const data = this.state.data;
    const widgets = [];
    // Building widgets
    this.state.layout.forEach(widget => {
      if (widget.active) {
        const Chart = charts[widget.i];
        const props = this.selectPropsToChart(widget.i);
        widgets.push(<Widget key={widget.i}><Chart {...props} /></Widget>);
      }
    }, this);

    return (
      <div id="dashboard-container">
        {/*<div className={'sidenav ' + (this.state.isSideMenuOpen ? 'is-open' : '')}>
          <Filter columnSize="is-12" data={this.state.filterState} newData={this.newData} />
        </div>*/}
        <div className={'sidenav ' + (this.state.isDbpediaMenuOpen ? 'is-open' : '')}>
          <DbpediaMenu columnSize="is-12" dbpediaQuery={this.state.dbpediaQuery} menuOpen={this.state.isDbpediaMenuOpen} />
        </div>
        <div className={'widgetnav ' + (this.state.isWidgetMenuOpen ? 'is-open' : '')}>
          <WidgetMenu onItemSelect={this.onWidgetMenuItemSelect} list={this.state.layout} />
        </div>
        {
          !this.state.loader ? null :
            <div className='has-text-centered hero is-fullheight loadingIcon'>
              <img src={loading} />
            </div>
        }
        <div id="dashboard-body" onClick={this.closeMenus}>
          {
            this.state.changingLayout ? null :
              <GridLayout
                className={"layout " + this.state.theme}
                isDraggable={false} // this.state.isDraggable
                layout={this.state.layout}
                cols={LAYOUT.COLS_NUMBER}
                rowHeight={LAYOUT.ROW_HEIGHT}
                useCSSTransforms={LAYOUT.USE_CSS_TRANSFORMS}
                onLayoutChange={this.onLayoutChange}>
                { widgets }
              </GridLayout>
          }
        </div>
        <Joyride
          ref={c => (this.joyride = c)}
          type={'continuous'}
          scrollToSteps={true}
          showStepsProgress={true}
          steps={JOY_RIDE_STEPS}
          run={this.state.infoRun} // or some other boolean for when you want to start it
          debug={false}
          showSkipButton={true}
          locale={{ back: 'Voltar', close: 'Fechar', last: 'Fim', next: 'Proximo', skip: 'Pular' }}
          callback={this.infoEnd}
        />
      </div>
    );
  }
}