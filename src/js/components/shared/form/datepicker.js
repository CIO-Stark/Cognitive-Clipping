import React from 'react';
import DP from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

/**
 * More info about react-datepicker: https://github.com/Hacker0x01/react-datepicker
 * Properties:
 * start (string) -> initial date
 * minDate (string) -> min date
 * maxDate (string) -> max date
 * placeholder (string) -> text to show when no value is set
 */

const locale = 'pt-BR';
const format = 'YYYY/MM/DD';

const DatePicker = (props) => {
  const start = props.start ? moment(props.start) : null;
  const minDate = props.minDate ? moment(props.minDate) : null;
  const maxDate = props.maxDate ? moment(props.maxDate) : null;

  const onChange = (event, index) => {
    if (event && event._d) {
      let date = moment(event._d).format('YYYY-MM-DD');
      props.onChange(date, index)
    }
  }

  return (
    <div className="field">
      <label className="label">{props.label}</label>
      <div className="control has-icons-left">
        <DP
          locale={locale}
          dateFormat={format}
          selected={start}
          className="input bg_white datepicker"
          minDate={minDate}
          maxDate={maxDate}
          onChange={event => { onChange(event, props.index) }}
          placeholderText={props.placeholder} />
        <span className="icon is-small is-left">
          <i className="fa fa-calendar"></i>
        </span>
      </div>
    </div>
  );
}

export default DatePicker;