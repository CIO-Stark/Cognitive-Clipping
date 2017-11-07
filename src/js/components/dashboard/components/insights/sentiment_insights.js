import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';

class SentimentInsights extends Component {

    constructor(props) {
        super(props);

        this.state = {
            bundle: {
                datasets: [{
                    data: null,
                    backgroundColor: ['#00BAA1', '#D0DADA', '#DC267F'],
                    hoverBackgroundColor: ["#009480", "#a6aeae", "#b01e65"]
                }],

                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: [
                    'Positivo',
                    'Neutro',
                    'Negativo'
                ]
            },
            chartOptions: {
                tooltips: {
                    enabled: true
                },
                hover: {
                    animationDuration: 3
                },
                responsive: true,
                legend: {
                    display: false
                },
                scaleFontFamily: "Quadon Extra Bold"
            }
        };
    }

    componentDidMount() {
        let bundle = this.state.bundle;
        let totals = this.props.totals;

        bundle.datasets[0].data = [totals.positive, totals.neutral, totals.negative];

        this.setState({ bundle });
    }

    render() {
        return (
            <div className="insight notification sentiment-doughnut">
                <h5 className="title is-6">Totais</h5>
                <Doughnut data={this.state.bundle} options={this.state.chartOptions} height={0} width={0} />
                <h2 className='title has-text-centered is-6'>{this.props.totals.total}</h2>
            </div>
        );
    }
}

export default SentimentInsights;