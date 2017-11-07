import React, { Component } from 'react';
import Slider from 'rc-slider';
// import Range from 'rc-slider/lib/Range';
// import Tooltip from 'rc-tooltip';
import moment from 'moment';

moment.locale('br');

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const DATE_FORMAT = 'YYYY-MM-DD';
const EMIT_TIMEOUT = 2000;

class DateSlider extends Component {
    constructor (props, context) {
        super(props, context);

        this.state = {
            value: [props.min, props.max],
            min: props.min,
            max: props.max
        };

        this.updateTimerCancel = null;

        this.handleChange = this.handleChange.bind(this);
        this.emitChange = this.emitChange.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            min: nextProps.min,
            max: nextProps.max
        });
    }

    formatDate (value) {
        return moment(value).format(DATE_FORMAT);
    }

    emitChange () {
        this.props.onChange(this.state.value);
    }

    handleChange (value) {
        this.setState({ value }, () => {
            if (this.updateTimerCancel) {
                clearTimeout(this.updateTimerCancel);
            }
            this.updateTimerCancel = setTimeout(this.emitChange, EMIT_TIMEOUT);
        });
    }

    render () {
        return (
            <Range 
                value={this.state.value}
                onChange={this.handleChange}
                min={this.state.min}
                max={this.state.max}
                allowCross={false}
                tipFormatter={this.formatDate}
                tipProps={{ placement: 'bottom', prefixCls: 'rc-slider-tooltip' }} />
        );
    }
}

export default DateSlider;