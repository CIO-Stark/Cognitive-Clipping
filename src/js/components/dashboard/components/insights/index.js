import React from 'react';

import Most from './most';
import Keyword from './keyword';
import Average from './average';

import SentimentInsights from './sentiment_insights';

const Insights = props => {
    let insights = props.data;

    return (
        <div className="insights widgetContentInsights">
            <div className="tile is-ancestor">

                    <div className="tile is-3">
                        <Keyword words={insights.keywords} />
                    </div>
                    <div className="tile is-3">
                        <SentimentInsights totals={insights.totals} />
                    </div>
                    <div className="tile is-3">
                        {insights.mostPositive ? <Most item={insights.mostPositive} title="O mais Positivo" /> : null}
                    </div>
                    <div className="tile is-3">
                        {insights.mostNegative ? <Most item={insights.mostNegative} title="O mais Negativo" /> : null}
                    </div>
                
            </div>
        </div>  
    );
}

export default Insights;