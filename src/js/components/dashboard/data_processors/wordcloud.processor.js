import * as utils from '../../../utils/utils';

let indexes = null;
let words = null;
let max = null;
let min = null;

/**
 * 
 * @param {string} source 
 */
function resolveSourceProperty (source) {
    switch(source) {
        case 'facebook':
        case 'twitter':
            return 'socialMedia';
        case 'nodecrawler': return 'articles';
        case 'filecrawler': return 'files';
        case 'connections': return 'connections';
        default:
            console.warn(`resolveSourceProperty:error ${source} is unknow.`);
            return 'unknow';
    }
};

function calculateWeightFactor (max) {
    if (max < 26) {
        return 25;
    } else if (max < 101) {
        return 100;
    } else {
        return 300;
    }
}

/**
 * 
 */
export function init () {
    words = {
        socialMedia: [],
        articles: [],
        files: [],
        connections: []
    };
    indexes = {
        socialMedia: {},
        articles: {},
        files: {},
        connections: {}
    };
    max = {
        socialMedia: 0,
        articles: 0,
        files: 0,
        connections: 0
    };
    min = {
        socialMedia: 999,
        articles: 999,
        files: 999,
        connections: 999
    };
}

/**
 * 
 * @param {object} entry 
 */
export function process (entry) {
    if (!entry || !entry.keywords.length) {
        return;
    }

    let keywords = entry.keywords;
    let source = resolveSourceProperty(entry.source);
    
    keywords.forEach(keyword => {
        if (keyword.relevance > 0.7) {
            const text = keyword.text.toLowerCase();
            
            if (indexes[source][text] === undefined) {
                indexes[source][text] = words[source].length;
                words[source].push({ word: keyword.text, weight: 0, data: [] });
            }
    
            if (utils.indexOfObject(words[ source ][ indexes[source][text] ].data, entry._id, '_id') === -1) { // conditional set due to keywords duplicates
                words[ source ][ indexes[source][text] ].weight++;
                words[ source ][ indexes[source][text] ].data.push(entry);

                if (max[source] < words[ source ][ indexes[source][text] ].weight) {
                    max[source] = words[ source ][ indexes[source][text] ].weight;
                }
                if (min[source] > words[ source ][ indexes[source][text] ].weight) {
                    min[source] = words[ source ][ indexes[source][text] ].weight;
                }
            }
        }
    });
}

/**
 * 
 * @param {object} wordcloud
 */
export function finish (object) {
    // font sizes
    const MIN_SIZE = 12;
    const MAX_SIZE = 32;
    // format words weight
    for (let type in words) {
        words[type].sort((a,b) => {
            return a.weight - b.weight;
        });

        words[type] = words[type].slice((words[type].length - 100),words[type].length).reverse();
        
        words[type] = words[type].filter(entry => {
            // (oldValue - min ) / (max - min) * (maxFontSize - minFontSize) + minFontSize
            entry.weight = ((entry.weight - min[type]) / ((max[type] - min[type])) || 0) * (MAX_SIZE - MIN_SIZE) + MIN_SIZE;
            return entry.weight > 0;
        });
    }
    
    object.trends = words;

    // clean data holders
    words = null;
    indexes = null;
    max = null;
}