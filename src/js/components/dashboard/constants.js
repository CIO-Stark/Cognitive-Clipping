// layout setup
export const LAYOUT = {
  COLS_NUMBER: 3,
  ROW_HEIGHT: 180,
  USE_CSS_TRANSFORMS: true
};

// default widget's positions
export const WIDGET = {
    INSIGHTS: {
        i: 'insights',
        x: 0,
        y: 0,
        w: 3,
        h: 1,
        minW: 3,
        maxH: 1,
        active: true
    },
    CORRELATION: {
        i: 'correlation',
        x: 0,
        y: 0,
        w: 2,
        h: 4,
        minW: 2,
        active: true,
        isDraggable: false
    },
    TIME_LINE: {
        i: 'time_line',
        x: 2,
        y: 0,
        w: 1,
        h: 4,
        active: true
    },
    TRENDS: {
        i: 'trends',
        x: 0,
        y: 0,
        w: 1,
        h: 2,
        active: true
    },
    REPORT: {
        i: 'report',
        x: 1,
        y: 0,
        w: 1,
        h: 2,
        active: true
    },
    CHANNEL: {
        i: 'channel',
        x: 2,
        y: 0,
        w: 1,
        h: 2,
        active: true
    }
};

export const FILTER_STATE = {
    date: [
        {
        date: "",
        placeholder: "Data Inicial",
        value: "dateStart"
        },
        {
        date: "",
        placeholder: "Data Final",
        value: "dateEnd"
        }
    ],
    sentiments: [
        {
        value: "positive",
        name: "Positivo",
        checked: true
        },
        {
        value: "neutral",
        name: "Neutro",
        checked: true
        },
        {
        value: "negative",
        name: "Negativo",
        checked: true
        }
    ],
    entities: [
        {
        value: "",
        checked: false,
        }
    ],
    contexts: "loader",
    articleProfile: {
        value: "Artigos",
        checked: true
    },
    articles: [
        {
        value: "Exame",
        checked: true
        },
        {
        value: "Folha",
        checked: true
        },
        {
        value: "Globo",
        checked: true
        },
        {
        value: "Istoe",
        checked: true
        },
        {
        value: "Olhardigital",
        checked: true
        },
        {
        value: "Tecmundo",
        checked: true
        },
        {
        value: "Uol",
        checked: true
        }
    ],
    socialMediaProfile: {
        value: "Social Media",
        checked: true
    },
    socialMedia: [
        {
        value: "facebook",
        name: "Facebook",
        checked: true
        },
        {
        value: "twitter",
        name: "Twitter",
        checked: true
        }
    ],
    files: [
    ],
    filesProfile: {
        value: "Arquivos",
        checked: false
    },
    exclude: [
    ]
};

export const JOY_RIDE_STEPS = [
    {
    title: 'Gráfico de Correlação',
    text: 'Esse gráfico demonstra os principais termos que se relacionam com a entidade selecionada e foram encontrados nos documentos e publicações analisadas. Além disso, ele demonstra qual o tipo de documento e sentimento predominante.',
    selector: '.widgetContentNetworkChart',
    position: 'top',
    type: 'hover',
    style: {
        beacon: {
        offsetX: 10,
        offsetY: 10,
        inner: '#009BEF',
        outer: '#009BEF'
        },
        back: {
        color: '#009BEF'
        },
        backgroundColor: '#FBFCFC',
        button: {
        backgroundColor: '#009BEF'
        },
        header: {
        borderBottom: '2px solid #65a1cb'
        }
    }
    }, {
    title: 'Linha do tempo',
    text: 'Traz em ordem cronológica todas as publicações relacionadas aos filtros aplicados e documentos adicionados. O cartão de cada publicação ilustra o sentimento predominante no texto, e possibilita que visualização dos detalhes da publicação ou documento.',
    selector: '.widgetContentTimeline',
    position: 'left',
    type: 'hover',
    style: {
        beacon: {
        offsetX: 10,
        offsetY: 10,
        inner: '#009BEF',
        outer: '#009BEF'
        },
        back: {
        color: '#009BEF'
        },
        backgroundColor: '#FBFCFC',
        button: {
        backgroundColor: '#009BEF'
        },
        header: {
        borderBottom: '2px solid #65a1cb'
        }
    }
    }, {
    title: 'Insights',
    text: 'Traz uma visão rápida de alguns fatos relevantes identificados na análise, como principais termos e resumo da análise de sentimento.',
    selector: '.widgetContentInsights',
    position: 'top-left',
    type: 'hover',
    style: {
        beacon: {
        offsetX: 10,
        offsetY: 10,
        inner: '#009BEF',
        outer: '#009BEF'
        },
        back: {
        color: '#009BEF'
        },
        backgroundColor: '#FBFCFC',
        button: {
        backgroundColor: '#009BEF'
        },
        header: {
        borderBottom: '2px solid #65a1cb'
        }
    }
    }, {
    title: 'Nuvem de Palavras',
    text: 'Neste gráfico são exibidos os termos mais relevantes identificados nas publicações e documentos analisados. Neste gráfico, é possível filtrar o resultado por Documentos, Media Social e Artigos.',
    selector: '.widgetContentWordCloud',
    position: 'top-left',
    type: 'hover',
    style: {
        beacon: {
        offsetX: 10,
        offsetY: 10,
        inner: '#009BEF',
        outer: '#009BEF'
        },
        back: {
        color: '#009BEF'
        },
        backgroundColor: '#FBFCFC',
        button: {
        backgroundColor: '#009BEF'
        },
        header: {
        borderBottom: '2px solid #65a1cb'
        }
    }
    }, {
    title: 'Sentimentos por Canal',
    text: 'Esta visualização demonstra a quantidade de publicações encontradas em cada fonte de dado, classificadas de acordo com o sentimento predominante.',
    selector: '.widgetSentimentBySource',
    position: 'top-left',
    type: 'hover',
    style: {
        beacon: {
        offsetX: 10,
        offsetY: 10,
        inner: '#009BEF',
        outer: '#009BEF'
        },
        back: {
        color: '#009BEF'
        },
        backgroundColor: '#FBFCFC',
        button: {
        backgroundColor: '#009BEF'
        },
        header: {
        borderBottom: '2px solid #65a1cb'
        }
    }
    }, {
    title: 'Relatório de Sentimento',
    text: 'Demonstra a quantidade de publicações no decorrer do tempo, classificadas de acordo com o sentimento predominante no texto.',
    selector: '.widgetSentimentTimeline',
    position: 'top-left',
    type: 'hover',
    style: {
        beacon: {
        offsetX: 10,
        offsetY: 10,
        inner: '#009BEF',
        outer: '#009BEF'
        },
        back: {
        color: '#009BEF'
        },
        backgroundColor: '#FBFCFC',
        button: {
        backgroundColor: '#009BEF'
        },
        header: {
        borderBottom: '2px solid #65a1cb'
        }
    }
    }
];
