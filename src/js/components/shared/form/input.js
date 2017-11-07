import React from 'react';

const Input = (props) => {
    return (
        <div className="field">
            <label className="label">{props.label}</label>
            <p className="control has-icons-left has-icons-right">
                <input className="input" type={props.type} placeholder={props.placeholder} onChange={props.onChange} />
            </p>
            <p className="help">{props.helper}</p>
        </div>
    )
}

export default Input;