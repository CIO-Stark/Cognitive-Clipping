import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

const options = {
    tooltips: {
        enabled: true
    },
    hover: {
        animationDuration: 3
    },
    responsive: true,
    scales: {
        xAxes: [{
            ticks: {
                beginAtZero: true,
                fontFamily: "'Open Sans Bold', sans-serif",
                fontSize: 11
            },
            scaleLabel: {
                display: false
            },
            gridLines: {
            },
            stacked: true
        }],
        yAxes: [{
            gridLines: {
                display: false,
                color: "#fff",
                zeroLineColor: "#fff",
                zeroLineWidth: 0
            },
            ticks: {
                fontFamily: "'Open Sans Bold', sans-serif",
                fontSize: 11
            },
            stacked: true
        }]
    },
    legend: {
        display: true
    },
    pointLabelFontFamily: "Quadon Extra Bold",
    scaleFontFamily: "Quadon Extra Bold"
};

const SentimentTimeline = props => {
    return (
        <div className='widget-content widgetSentimentTimeline'>
            <div className='widget-header'>
                <h5 className="title is-5">Relatório de Sentimento</h5>
            </div>

            <div id='wordcloud' style={{ width: '100%', height: 'calc(100% - 45px)' }}>
                <Line data={props.data} options={options} width={0} height={0} />
            </div>
        </div>
    );
};

export default SentimentTimeline;