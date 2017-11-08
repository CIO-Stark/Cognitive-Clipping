import React from 'react';

// image
import watson from '../../../../images/Watson@0.5x.png'

// css
import '../../../../css/banner.scss'

const Banner = (props) => {
    return (
        <div className="columns">
            <div className='column is-one-quarter'>
                <img src={watson} />
            </div>
            <div className='column margin-align-center'>
                <h1 className="title is-1 color-white">Bem-Vindo!</h1>
                <h3 className="subtitle is-3 color-white">Para começar selecione uma entidade, ou uma combinação de entidades com contexto e clique em analisar</h3>
            </div>
        </div>
    )
}

export default Banner;