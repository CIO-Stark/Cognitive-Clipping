import React from 'react';

const Checkbox = (props) => {
    return (
        <div className="field">
            <p className="control">
                <label className="checkbox">
                    <input type="checkbox" data-index={props.index} data-internal-index={props.internalIndex} value={props.value} onChange={props.onChange} checked={props.checked} />
                    {props.label}
                </label>
            </p>
        </div>
    );
}

export default Checkbox;