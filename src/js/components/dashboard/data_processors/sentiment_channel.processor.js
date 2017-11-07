let data = null;


function isZeroed (channel) {
    let noData = false;

    if (!channel.positive && !channel.negative && !channel.neutral) {
        noData = true;
    }

    return noData;
}

// ---------------------------------------------------------------------------------

export function init () {
    data = {
        filecrawler: {
            positive: 0,
            negative: 0,
            neutral: 0,
            label: 'Arquivos'
        },
        nodecrawler: {
            positive: 0,
            negative: 0,
            neutral: 0,
            label: 'Artigos'
        },
        facebook: {
            positive: 0,
            negative: 0,
            neutral: 0,
            label: 'Facebook'
        },
        twitter: {
            positive: 0,
            negative: 0,
            neutral: 0,
            label: 'Twitter'
        },
        connections: {
            positive: 0,
            negative: 0,
            neutral: 0,
            label: 'Connections'
        }
    };
}

export function process (entry) {
    data[entry.source][entry.sentiment.label]++;
}

export function finish(object) {
    const DATASET_POSITION = { positive: 0, neutral: 1, negative: 2 };
    let channelOpts = {
            labels: [],
            datasets: [{
                label: "Positivo",
                data: [],
                backgroundColor: "#00BAA1",
                hoverBackgroundColor: "#009480"
            },
            {
                label: "Neutro",
                data: [],
                backgroundColor: "#D0DADA",
                hoverBackgroundColor: "#a6aeae"
            },
            {
                label: "Negativo",
                data: [],
                backgroundColor: "#DC267F",
                hoverBackgroundColor: "#b01e65"
            }]
    };

    for (let source in data) {
        if (isZeroed(data[source])) continue;

        for (let prop in data[source]) {
            if (prop === 'label') {
                channelOpts.labels.push(data[source].label);
            } else {
                channelOpts.datasets[DATASET_POSITION[prop]].data.push(data[source][prop]);
            }
        }
    }

    object.channel = channelOpts;

    data = null;
}