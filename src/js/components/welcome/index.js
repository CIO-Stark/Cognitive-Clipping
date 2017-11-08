import React from 'react';

//components
import Banner from './component/banner';
import Filter from '../shared/filter';

import JOYRIDE_STEPS from './constants';

import Joyride from 'react-joyride';

export default class Welcome extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      infoRun: false
    }

    this.infoStart = this.infoStart.bind(this);
    this.infoEnd = this.infoEnd.bind(this);

  }

  componentDidMount() {
    this.props.subscribe('info', this.infoStart);
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

    return (
      // <div>{html}</div>
      <section className="hero is-fullheight bg_blue">
        <div className="hero-body">
          <div className="container">
            <Banner />
            <hr className='hr-welcome' />
            <Filter />
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