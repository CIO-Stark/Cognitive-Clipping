let keywords = null;
let sentiment = null;

/**
 * Keyword counter. 
 * @param  {object} entry raw data from API
 */
function countKeywords (entry) {
    if (entry.keywords && entry.keywords.length) {
        entry.keywords.forEach(keyword => {
            const text = keyword.text.toLowerCase();
            if (!keywords[text]) {
                keywords[text] = 0;
                // keywords[keyword.text] = { count: 0, data: [] };
            }
            keywords[text]++;
            // keywords[keyword.text].count++;
            // keywords[keyword.text].data.push(entry);
        });
    }
}

/**
 * Organize keywords object created by countKeywords and return the top 3 words based on how many times they show up
 * @return {array} top
 */
function getTopKeywords () {
    let karray = [];
    // pass keywords object to keywords array
    for (let keyword in keywords) {
        karray.push({ text: keyword, count: keywords[keyword] });
    }
    // sort keywords array
    karray.sort(function (a, b) {
        return a.count - b.count;
    });

    return karray.reverse().slice(0,10).map(entry => entry.text);
}

/**
 * Accumulate raw data sentiment results to create averages, totals and percentages
 * @param {object} entry 
 */
function checkSentiment (entry) {
    if (!entry.sentiment) {
        return;
    }

    let label = entry.sentiment.label;
    // count it
    sentiment.count[label].sum += entry.sentiment.score;
    sentiment.count[label].count++;
    // sentiment's total count
    sentiment.total++;
    // check if most positive or negative
    if (label !== 'neutral') {
        if (label === 'positive' && sentiment.mostPositive.score < entry.sentiment.score) {
            sentiment.mostPositive.data = entry;
            sentiment.mostPositive.score = entry.sentiment.score;
        } else if (label === 'negative' && sentiment.mostNegative.score > entry.sentiment.score) {
            sentiment.mostNegative.data = entry;
            sentiment.mostNegative.score = entry.sentiment.score;
        }
    }
}

/**
 * Sentiment average totals. Returns both average value and it's percentage
 * @return {object}
 */
function setSentimentAverages () {
    let average = {};

    for (let s in sentiment.count) {
        let avg = sentiment.count[s].sum / sentiment.count[s].count;

        if (isNaN(avg) || avg === 0) {
            average[s] = null;
        } else {
            average[s] = {
                average: avg,
                percentage: Math.abs(Math.floor(avg * 100))
            };
        }
    }

    return average;
}

/**
 * Return an object with sentiment and overall sentiment count
 * @return {object} totals
 */
function setSentimentTotals () {
    return {
        negative: sentiment.count.negative.count,
        positive: sentiment.count.positive.count,
        neutral: sentiment.count.neutral.count,
        total: sentiment.total
    };
}

// ---------------------------------------------------------------------------------

/**
 * Data holder bootstrap
 */
export function init () {
    keywords = {};
    sentiment = {
        count: {
            positive: { sum: 0, count: 0 },
            negative: { sum: 0, count: 0 },
            neutral:  { sum: 0, count: 0 }
        },
        total: 0,
        mostNegative: { score: 0, data: {} },
        mostPositive: { score: 0, data: {} },
    };

}

/**
 * Process an entry from the array of the raw data
 * @param {object} entry 
 */
export function process (entry) {
    countKeywords(entry);
    checkSentiment(entry);
}

/**
 * Finish formating data accumulated
 * @param {object} insights 
 */
export function finish (object) {
    let mostNegative = Object.keys(sentiment.mostNegative.data).length ? sentiment.mostNegative : null;
    let mostPositive = Object.keys(sentiment.mostPositive.data).length ? sentiment.mostPositive : null;
    
    object.insights = {
        keywords: getTopKeywords(),
        average: setSentimentAverages(),
        totals: setSentimentTotals(),

        mostNegative: mostNegative,
        mostPositive: mostPositive
    };

    // cleaning our data holders
    keywords = null;
    sentiment = null;
}