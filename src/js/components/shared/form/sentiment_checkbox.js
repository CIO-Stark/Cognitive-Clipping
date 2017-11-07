import React from 'react';

/**
 * Properties:
 * label (string) -> sentiment's label
 * sentiment (string) -> positive, negative or neutral
 * onChange (function) -> 'checkbox' change handler
 */

const SentimentCheckbox = (props) => {
  // our 'checkbox' change handler. It toggles icons classe and send back (to the upper change handler) the label sent
  const onChange = (event, label) => {
    if (props.onChange) { // just do the work if there is a change listener
      let parent = event.target;
      let icon;

      // if true, it's the father element
      if (!parent.getAttribute('data-sentimentbox')) {
        while (true) {
          parent = parent.parentNode;
          if (parent.getAttribute('data-sentimentbox')) break;
        }
      }

      parent.querySelector('i.fa').classList.toggle('fa-check');
      props.onChange(label);
    }

    event.preventDefault();
  };

  const sentimentClass = 'bg_' + props.sentiment.toLowerCase();

  return (
    <div className="sentiment-checkbox clickable" data-sentimentbox onClick={event => { onChange(event, props.label) }}>
      <span className={`check icon ${sentimentClass}`}>
        <i className="fa fa-check"></i>
      </span>
      <span className="label">{props.label}</span>
    </div>
  );
}

export default SentimentCheckbox;