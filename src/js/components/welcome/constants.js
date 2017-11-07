// Joyride steps for welcome page
export default [
    {
    title: 'Período',
    text: 'Selecione as datas de início e fim para delimitar de qual período a informação será exibida. **opcional** Neste caso, em redes sociais e artigos são consideradas a data de publicação, e para documentos se considera o período definido no carregamento do mesmo.',
    selector: '#periodofilter',
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
    title: 'Sentimentos',
    text: 'Neste filtro é possível selecionar quais sentimentos serão exibidos na análise. Caso um sentimento seja removido, todos os gráficos, publicações e documentos serão ajustados de acordo com os sentimentos selecionados.',
    selector: '#sentimentsFilter',
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
    title: 'Entidades',
    text: 'Entidade é um termo pesquisado nas fontes de dados. Selecione ao menos uma entidade para realizar a análise.',
    selector: '#entitiesFilter',
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
    title: 'Contextos',
    text: 'Neste filtro é possível selecionar em qual contexto a entidade selecionada será exibida. O contexto é definido com base no sentido entendido pelo Watson do texto analisado.',
    selector: '#contextFilter',
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
    title: 'Fontes dos Dados',
    text: 'Neste filtro é possível delimitar de quais fontes de dados serão exibidas as informações.',
    selector: '#sourcesFilter',
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
    title: 'Excluir',
    text: 'Esse filtro te permite remover termos específicos da análise. Termos devem ser separados por vírgula.',
    selector: '#excludeFilter',
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
    title: 'Analizar',
    text: 'Click em analisar para ver os resultados.',
    selector: '#analyseFilter',
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