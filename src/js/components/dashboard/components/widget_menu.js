import React from 'react';
import { Checkbox } from '../../shared/form/index';
import relatorioImage from '../../../../images/relatorio.png';
import insightImage from '../../../../images/insights.png';
import channelImage from '../../../../images/channel.png';
import timelineImage from '../../../../images/timeline.png';
import wordcloudImage from '../../../../images/wordcloud.png';

const items = {
  report: { label: 'Relatório', image: relatorioImage },
  insights: { label: 'Insights', image: insightImage },
  channel: { label: 'Canais', image: channelImage },
  time_line: { label: 'Time Line', image: timelineImage },
  trends: { label: 'Wordcloud', image: wordcloudImage },
  correlation: { label: 'Correlações', image: wordcloudImage },
}

const WidgetMenu = props => {
  return (
    <div>
      <div className="level">
        <div className="level-item level-left">
          <p>Widgets</p>
        </div>
      </div>

      <div className="columns">
        {
          props.list.map(widget => {
            return (
              <div className="column has-text-centered" key={widget.i}>

                <div className="widget-image" onClick={() => { props.onItemSelect(widget); }}>
                  <span className="icon">
                    {
                      widget.active ?
                      <i className="ibm-icon ibm-close-cancel-error"></i> :
                      <i className="ibm-icon ibm-add-new"></i>
                    }
                  </span>
                  <img src={items[widget.i].image} alt={items[widget.i].label} />
                  <div className="label">
                    <p className="has-text-centered">{items[widget.i].label}</p>
                  </div>
                </div>
                
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

export default WidgetMenu;