import moment from 'moment';
moment.updateLocale('pt');

const MONTH = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const dateFormats = ['YYYY-MM-DD', 'DD.MM.YY', 'DD/MM/YYYY', 'DD MM YYYY'];
const dateRegex = /[^0-9\.\/\-h].*/gi;

let set = null;

let totals = {
    positive: 0,
    negative: 0,
    neutral: 0
};

/**
 * 
 */
function yearModel() {
    return new Array(12);
}

/**
 * 
 */
function sentimentCountModel () {
    return { positive: 0, neutral: 0, negative: 0 };
}

/**
 * 
 * @param {string} string 
 */
function parseDate (string) {
    if (string) {
        return moment(string.replace(dateRegex, ''), dateFormats);
    }
    return null;
}

// ---------------------------------------------------------------------------------

export function init () {
    set = {};
}

export function process (entry) {
    if (entry.source !== 'filecrawler') {
        let date = entry.date.toString().trim();
        let formatedDate = parseDate(date).format(dateFormats[0]);
        let splittedDate = formatedDate.split('-'),
            year = splittedDate[0],
            month = parseInt(splittedDate[1]) - 1;

        if (!set[year]) {
            set[year] = yearModel();
        }

        if (!set[year][month]) {
            set[year][month] = sentimentCountModel();
        }

        set[year][month][entry.sentiment.label]++;
        totals[entry.sentiment.label]++;
    }
}

export function finish (object) {
    // console.log('Totals: ', totals);
    let label = [],
        sentiment = {
            positive: [],
            negative: [],
            neutral: []
        };

    for (let year in set) {
        set[year].forEach((entry, index) => {
            if (entry && (entry.neutral || entry.negative || entry.positive)) {
                label.push(`${MONTH[index].slice(0,3)}-${year.slice(2,4)}`);
                sentiment.positive.push(entry.positive || 0);
                sentiment.negative.push(entry.negative || 0);
                sentiment.neutral.push(entry.neutral || 0);
            }
        });
    }

    let sets = [
        {
            label: "Negative",
            fill: false,
            backgroundColor: "rgba(220,38,127,0.5)",
            borderColor: "rgba(220,38,127,0.8)",
            hoverBackgroundColor: "rgba(220,38,127,0.75)",
            hoverBorderColor: "rgba(220,38,127,1)",
            showTooltip: false,
            lineTension: 0,
            pointRadius: 0,
            data: sentiment.negative,
            total: totals.negative
        },
        {
            label: "Neutral",
            fill: false,
            backgroundColor: "rgba(208,218,218,0.5)",
            borderColor: "rgba(208,218,218,0.8)",
            hoverBackgroundColor: "rgba(208,218,218,0.75)",
            hoverBorderColor: "rgba(208,218,218,1)",
            lineTension: 0,
            pointRadius: 0,
            data: sentiment.neutral,
            total: totals.neutral
        },
        {
            label: "Positive",
            fill: false,
            backgroundColor: "rgba(0,186,161,0.5)",
            borderColor: "rgba(0,186,161,0.8)",
            hoverBackgroundColor: "rgba(0,186,161,0.75)",
            hoverBorderColor: "rgba(0,186,161,1)",
            showTooltip: false,
            lineTension: 0,
            pointRadius: 0,
            data: sentiment.positive,
            total: totals.positive
        }
    ];

    sets.sort((a, b) => { return a.total - b.total; }).reverse();

    object.report = {
        labels: label,
        datasets: sets
    };
}