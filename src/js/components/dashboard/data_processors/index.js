import * as insights from './insights.processor';
import * as channel from './sentiment_channel.processor';
import * as report from './sentiment_report.processor';
import * as wordcloud from './wordcloud.processor';
import * as time_line from './timeline.processor';
import * as date from './date.processor';

// this object container properties with the same name as the widget ids
const process = {
   insights: insights,
   channel: channel,
   report: report,
   trends: wordcloud,
   time_line: time_line
};

/**
 * Execute init function of all given widget processors
 * @param {array} layout visible widgets
 */
function init (layout, shouldInitDate) {
    layout.forEach(chart => {
        if (process[chart]) 
            process[chart].init();
    });

    if (shouldInitDate) {
        date.init();
    }
}

/**
 * Execute finish function of all given widget processors
 * @param {array} layout layout visible widgets
 * @param {object} formattedObj formated data object
 */
function finish (layout, formattedObj, shouldFinishDate) {
    layout.forEach(chart => {
        if (process[chart]) 
            process[chart].finish(formattedObj);
    });

    if (shouldFinishDate) {
        date.finish(formattedObj);
    }
}

/**
 * Run each build logic from visible widgets
 * @param {array} data raw data from API
 * @param {array} layout visible widgets
 */
export default function processData (data, layout, shouldFindDate) {
    if (!data || !data.length) {
        return [];
    }

    const origemRegEx = /(\((fonte|origem) da imagem: \w+.*\)|\(Foto: Reprodução\))/i;
    let formatted = {};
    // bootstrap counters, dictionaries and anything necessary to hold data while processing it
    init(layout, shouldFindDate);
    // console.log('Data: \n',data);
    data.forEach(entry => {
        if (!origemRegEx.test(entry.text)) {
            layout.forEach(chart => {
                if (process[chart]) 
                    process[chart].process(entry);
            });
    
            if (shouldFindDate) {
                date.process(entry);
            }
        }
    });

    // get final results
    finish(layout, formatted, shouldFindDate);
    // console.log('Formatted data: ', formatted.date);
    return formatted;
};