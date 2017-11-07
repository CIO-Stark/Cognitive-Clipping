import React, { Component } from 'react';

import entitiesData from '../../../../../data/entity';
import fileData from '../../../../../data/file';
import form from '../../../../shared/form';
import * as Toast from '../../../../shared/toast/toast_service';

class File extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            isSaving: false
        };

        this.fileInput = null;

        this.delete = this.delete.bind(this);
        this.create = this.create.bind(this);
        this.setFileName = this.setFileName.bind(this);
    }
    
    removeInfo(event) {
        let parent = event.target.parentNode.parentNode.parentNode;
        let child = event.target.parentNode.parentNode;
        parent.removeChild(child);
    }

    componentDidMount() {
        fileData.get()
        .then(response => {
            this.setState({ files: response });
        })
        .catch(error => {
            console.error(error);
            Toast.open('Erro ao carrega a lista de dados. Tente mais tarde.', 'danger');
        });
    }

    compomentWillUnmount () {
        this.fileInput = undefined;
    }

    delete (file) {
        let files = this.state.files;
        let index = files.indexOf(file);

        files[index].isRemoving = true;
        this.setState({ files: files });

        fileData.remove(file)
        .then(fileData.get)
        .then(response => {
            this.setState({ files: response });
        })
        .catch(error => {
            console.error(error);
            Toast.open('Erro ao deletar o arquivo. Tente mais tarde.', 'danger');
            
            files[index].isRemoving = undefined;
            this.setState({ files: files });
        });
    }

    create() {
        let file = this.fileInput.files[0];
        
        if (file) {
            let formData = new FormData();
            
            formData.append("upload", file);
    
            this.setState({ isSaving: true });
    
            fileData.create(formData)
            .then(fileData.get)
            .then(response => {
                this.setState({ files: response, isSaving: false, filename: null });
            })
            .catch(error => {
                console.error(error);
                Toast.open('Erro ao salvar o arquivo. Tente mais tarde.', 'danger');
                this.setState({ isSaving: false, filename: null });
            });
        }
    }

    setFileName (event) {
        let file = this.fileInput.files[0];
        let filename = null;

        if (file) {
            filename = file.name;
        }

        this.setState({ filename });
    }

    render() {
        const addBtnClasses = 'button is-success btn-top-margin ' + (this.state.isSaving ? 'is-loading' : '');

        return (
            <div>
                <article className="message is-info">
                    <div className="message-header">
                        Info
                        <button className="delete" onClick={this.removeInfo}></button>
                    </div>
                    <div className="message-body">
                        <p>As buscas por arquivos devem estar relacionadas a uma entidade. O conteúdo dos arquivos será considerado junto com as outras buscas nas analises feitas.</p>
                        <p>Você pode criar buscas para cada entidade cadastrada. Para isso, selecione uma entidade e carregue os arquivos desejados. Na listagem de arquivos que aparecerá, preencha os campos de data início e fim para cada arquivo carregado, se desejar. Os campos de data focam a busca para o período de tempo cadastrado.</p>
                        <p>Use a coluna 'Ações' para deletar o pacote de busca desejado.</p>
                    </div>
                </article>
                <div className='columns'>
                    <div className="column is-one-third">
                        <p className="label">Arquivo</p>
                        <div className="file is-fullwidth">
                            <label className="file-label">
                                <input id="file" className="file-input" type="file" name="resume" ref={element => { this.fileInput = element }} onChange={this.setFileName} />    
                                <span className="file-cta">
                                    <span className="file-icon"><i className="ibm-icon ibm-upload-export"></i></span>
                                    { 
                                        this.state.filename ?
                                        <span className="file-label"> { this.state.filename } </span> :
                                        <span className="file-label"> Escolha um arquivo… </span>
                                    }
                                </span>
                            </label>
                        </div>
                        <button onClick={this.create} className={addBtnClasses}>
                            <span>Adicionar</span>
                        </button>
                    </div>
                    <div className="column">
                        <table className='table is-striped is-fullwidth'>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Data do Upload</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.files.map((file, index) => {
                                    const removeActClasses = 'button is-info is-small ' + (file.isRemoving ? 'is-loading' : '');
                                    
                                    return (
                                        <tr key={index}>
                                            <td>{file.filename}</td>
                                            <td>{file.upload_date}</td>
                                            <td>
                                                <button onClick={event => { this.delete(file) }} className={removeActClasses} title='Remover'>
                                                    <span className='icon is-small'> { file.isRemoving ? null : <i className="fa fa-trash"></i> } </span>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default File;