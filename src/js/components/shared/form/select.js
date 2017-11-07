import React from 'react';

const Select = (props) => {
    return (
        <div className="field">
            <p className="control">
                <span className="select is-small">
                    <select onChange={props.onChange}>
                        {props.options.map((option, index) => {
                            return (
                                <option key={index} value={option.value}>{option.name}</option>
                            )
                        })}
                    </select>
                </span>
            </p>
        </div>
    );
}

export default Select;