import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import utils from '../../utils/utils';

// Component
import form from '../shared/form';
import loading from '../../../images/loading.gif';

// Data
import dbpedia from '../../data/dbpedia';
import entity from '../../data/entity';


import Joyride from 'react-joyride';

class DbpediaMenu extends Component {
    constructor(props) {
        super(props);

        this.dbpediaDataCompare = { type: '', value: '' };
        
        this.state = {
            dbpediaQuery: { type: '', value: '' },
            dbpediaData: { uri : '', genericDescription : '', ptDescription : '', enDescription : '', imgURL : ''}
        };

        //this.createFields = this.createFields.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log("props", this.props.dbpediaQuery, this.dbpediaDataCompare, prevProps, prevState);

        if(this.dbpediaDataCompare.value !== this.props.dbpediaQuery.value){

                dbpedia.getData(this.props.dbpediaQuery.value, this.props.dbpediaQuery.type).then(response => {
                    console.log("dbpedia", response);
                    this.setState({dbpediaData : response }); 
                              
                }).catch(erro =>{
                    console.error("error or no data found while retrieving dbpedia data", erro);
                    this.setState({})
                }); 

                this.dbpediaDataCompare = this.props.dbpediaQuery;

            }
        

    }

    createImgRow(){
        return (
                    <div className='column is-half is-offset-one-quarter'>
                        {
                            this.state.dbpediaData.imgURL ?
                                <img src={this.state.dbpediaData.imgURL}/>
                            : ''
                        }
                    </div>
                    
        )
    }
    createDescriptionRow(){
        return (
                    <div className='column is-12'>
                            {this.state.dbpediaData.ptDescription ? 
                                this.state.dbpediaData.ptDescription
                                : 'Não foi possível encontrar a descrição desta pesquisa. Por favor tente com outra entidade.'
                            }
                    </div>
                    
        )
    }



    render() {
        const columnSize = this.props.columnSize ? this.props.columnSize : 'is-half';
        const columnClasses = `column ${columnSize}`

        return (
            <div className="container">
                <div className='columns is-multiline'>
                    <div className='column is-12'>
                        {
                            this.props.dbpediaQuery.type ?
                                <h4 className="title is-4 color-filter-blue">{this.props.dbpediaQuery.value}</h4>
                            : <h4 className="title is-4 color-filter-blue">{this.props.dbpediaQuery.value}</h4>
                        }
                        
                    </div>
                    {this.createImgRow()}
                    {this.createDescriptionRow()}  
                   
                    
                </div>
                
            </div >
        );
    }
}

export default DbpediaMenu;