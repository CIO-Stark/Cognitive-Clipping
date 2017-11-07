// real data for some tests;
const rawData = require('./raw_data.test');
const processors = {
    wordcloud: require('../wordcloud.processor'),
    insights: require('../insights.processor'),
    channel: require('../sentiment_channel.processor'),
    report: require('../sentiment_report.processor')
};

describe('Data processors', () => {
    function processData (processor, data) {
        let result = {};
        processors[processor].init();
        
        data.forEach(element => {
            processors[processor].process(element);
        });

        processors[processor].finish(result);
        return result;
    }

    // Sentiment Report Suit
    describe('Sentiment Report', () => {
        const processor = 'report';
        const data = require('./report_data.test');
        const result = processData(processor, data);

        test('Label order should be "Jan-17", "Fev-17", "Mar-17", "Abr-17", "Jul-17", "Set-17", "Out-17", "Dez-17"', () => {
            expect(result.report.labels).toEqual(["Jan-17", "Fev-17", "Mar-17", "Abr-17", "Jul-17", "Set-17", "Out-17", "Dez-17"]);
        });

        test('Dataset order should be Neutral, Positive, Negative', () => {
            expect(result.report.datasets[0].label).toBe("Negative");
            expect(result.report.datasets[1].label).toBe("Positive");
            expect(result.report.datasets[2].label).toBe("Neutral");
        });
        
        test('Positive data should be [ 0, 0, 1, 0, 1, 0, 0, 1 ]', () => {
            expect(result.report.datasets[1].data).toEqual([ 0, 0, 1, 0, 1, 0, 0, 1 ]);
        });

        test('Negative data should be [ 1, 1, 0, 0, 0, 1, 1, 0 ]', () => {
            expect(result.report.datasets[0].data).toEqual([ 1, 1, 0, 0, 0, 1, 1, 0 ]);
        });

        test('Neutral data should be [ 0, 0, 0, 1, 0, 0, 0, 0 ]', () => {
            expect(result.report.datasets[2].data).toEqual([ 0, 0, 0, 1, 0, 0, 0, 0 ]);
        });

        test('With 2 files items, they info should not affect result', () => {
            const dataFiles = [{ "source": "filecrawler", "sentiment": { "label": "positive" } }, { "source": "filecrawler", "sentiment": { "label": "neutral" } }];
            const dataWithFiles = dataFiles.concat(data);
            const resultWithFiles = processData(processor, dataWithFiles);

            expect(resultWithFiles.report.datasets[0].label).toBe("Negative");
            expect(resultWithFiles.report.datasets[0].data).toEqual([ 1, 1, 0, 0, 0, 1, 1, 0 ]);
            expect(resultWithFiles.report.datasets[1].label).toBe("Positive");
            expect(resultWithFiles.report.datasets[1].data).toEqual([ 0, 0, 1, 0, 1, 0, 0, 1 ]);
            expect(resultWithFiles.report.datasets[2].label).toBe("Neutral");
            expect(resultWithFiles.report.datasets[2].data).toEqual([ 0, 0, 0, 1, 0, 0, 0, 0 ]);
        });
    });

    // Sentiment Channel Suit
    describe('Sentiment Channel', () => {
        const processor = 'channel';
        const data = require('./channel_data.test');
        const result = processData(processor, data);

        test('Label order should be "Arquivos", "Artigos", "Twitter", "Facebook"', () => {
            expect(result.channel.labels).toEqual(["Arquivos", "Artigos", "Twitter", "Facebook"]);
        });

        test('Dataset order should be Positives, Neutrals and Negatives', () => {
            expect(result.channel.datasets[0].label).toBe("Positivo");
            expect(result.channel.datasets[1].label).toBe("Neutro");
            expect(result.channel.datasets[2].label).toBe("Negativo");
        });

        test('Positive data should be [0, 2, 1, 1]', () => {
            expect(result.channel.datasets[0].data).toEqual([0, 2, 1, 1]);
        });

        test('Neutral data should be [0, 0, 0, 2]', () => {
            expect(result.channel.datasets[1].data).toEqual([0, 0, 0, 2]);
        });

        test('Negative data should be [0, 2, 1, 0]', () => {
            expect(result.channel.datasets[2].data).toEqual([0, 2, 1, 0]);
        });
    });

    // Insights Suit
    describe('Insights', () => {
        const processor = 'insights';
        const data = require('./insights_data.test');
        const result = processData(processor, data);
        // Keywords repeat reate: 5,3,2,1,1
        // Sentiment totals: Positve 2, Negative 2 and neutral 1
        
        test('Top keywords should be word1, word3, word2, word5, word4', () => {
            expect(result.insights.keywords).toEqual([ 'word1', 'word3', 'word2', 'word5', 'word4' ]);
        });

        test('Totals should be negative 2, positive 2 and neutral 1', () => {
            expect(result.insights.totals).toEqual({ negative: 2, positive: 2, neutral: 1, total: 5 });
        });

        test('Positive average should be 40 (0.4)', () => {
            expect(result.insights.average.positive).toEqual({ average: 0.4, percentage: 40 });
        });

        test('Negative average should be 31 (-0.31)', () => {
            expect(result.insights.average.negative).toEqual({ average: -0.31, percentage: 31 });
        });

        test('Neutral average should be null', () => {
            expect(result.insights.average.neutral).toBe(null);
        });

        test('Most positive should have have score 0.5 and property data', () => {
            expect(result.insights.mostPositive).toEqual(expect.objectContaining({ score: 0.5, data: expect.any(Object) }));
        });

        test('Most negative should have have score -0.4 and property data', () => {
            expect(result.insights.mostNegative).toEqual(expect.objectContaining({ score: -0.4, data: expect.any(Object) }));
        });
    });

    // Keywords Suit
    describe('Wordcloud (trends)', () => {
        const processor = 'wordcloud';
        const data = require('./wordcloud_data.test');
        const processedRawData = processData(processor, rawData.data);

        test('each source property must be an array', () => {
            let result = processData(processor, data);
            expect(result.trends).toEqual(expect.objectContaining({ files: expect.any(Array), articles: expect.any(Array), socialMedia: expect.any(Array) }));
        });

        // test('each source array must have valid itens ({ word: string, weight: number, data: []ofDocs }) or be empty', () => {
        //     let result = processData(processor, rawData.data);
            
        //     const word  = expect.any(String);
        //     const weight = expect.any(Number);
        //     const dataList = expect.arrayContaining([expect.objectContaining({
        //         _id: expect.any(String),
        //         _rev: expect.any(String)
        //     })]);

        //     expect(processedRawData.trends.articles).toEqual(expect.arrayContaining([expect.objectContaining({ word, weight, dataList })]));
        // });

        describe('With 5 different keywords, repeated this way: 4,3,2,2,1', () => {
            let mocked = [
                { source: 'nodecrawler', keywords: [{ text: 'word1', relevance: 0.9 }, { text: 'word2', relevance: 0.9 }, { text: 'word3', relevance: 0.9 }] },
                { source: 'nodecrawler', keywords: [{ text: 'word1', relevance: 0.9 }, { text: 'word2', relevance: 0.9 }, { text: 'word3', relevance: 0.9 }] },
                { source: 'nodecrawler', keywords: [{ text: 'word1', relevance: 0.9 }, { text: 'word3', relevance: 0.9 }, { text: 'word4', relevance: 0.9 }] },
                { source: 'nodecrawler', keywords: [{ text: 'word1', relevance: 0.9 }, { text: 'word4', relevance: 0.9 }, { text: 'word5', relevance: 0.9 }] },
            ];
            let result = processData(processor, mocked);

            test('the most repeated word weight is 32', () => {
                expect(result.trends.articles[0].weight).toBe(32);
            });

            test('the second most repeated word weight is 24', () => {
                expect(result.trends.articles[1].weight).toBe(24);
            });

            test('the third most repeated weight is 16', () => {
                expect(result.trends.articles[2].weight).toBe(16);
            });

            test('the fourth most repeated weight is 16', () => {
                expect(result.trends.articles[3].weight).toBe(16);
            });

            test('the least repeated weight is 8', () => {
                expect(result.trends.articles[4].weight).toBe(8);
            });
        });

        test('weights must be valid even when all keywords appears once', () => {
            let editableData = data;
            let result = {};
            processors.wordcloud.init();
    
            editableData.forEach((element, index) => {
                element.keywords.forEach(kw => { kw.text = `term${index}` });
                processors.wordcloud.process(element);
            });
    
            processors.wordcloud.finish(result);
            expect(result.trends.files).toEqual(expect.arrayContaining([expect.objectContaining({ weight: expect.any(Number) })]));
            expect(result.trends.articles).toEqual(expect.arrayContaining([expect.objectContaining({ weight: expect.any(Number) })]));
            expect(result.trends.socialMedia).toEqual(expect.arrayContaining([expect.objectContaining({ weight: expect.any(Number) })]));
        });

        test('arrays lengths must be smaller or equal to 100', () => {
            let data = rawData.data;
            let result = processedRawData;

            expect(result.trends.files.length).toBeLessThanOrEqual(100);
            expect(result.trends.articles.length).toBeLessThanOrEqual(100);
            expect(result.trends.socialMedia.length).toBeLessThanOrEqual(100);
        });
    });

});