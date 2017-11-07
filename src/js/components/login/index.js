import React, { Component } from 'react';
// import * as auth from '../../data/auth';
// import watsonLogo from '../../../images/watson.svg';

const DEFAULT_TIMEOUT = 4000;

class Login extends Component {
  
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      email: null,
      password: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.closeNotification = this.closeNotification.bind(this);
  }

  componentDidMount () {
    //   console.log(auth.isAuthenticated());
    // if (auth.isAuthenticated()) {
    //   this.props.history.push('/');
    // }
  }
  
  handleChange (event) {
    const target = event.target.id;
    const value = event.target.value;

    this.setState({ [target]: value });
  }

  authenticate (event) {
    event.preventDefault();
    let user = this.state;
    
    if (user.username && user.password) {
      auth.authenticate(user)
      .then(response => {
        if (response.status) {
            this.props.history.push('/');
        } else {
            this.setState({ message: response.message }, this.closeNotification);
        }
      })
      .catch(error => {
        this.setState({ message: 'Usuário ou senha inválidos.' }, this.closeNotification); 
      });
    } else {
      this.setState({ message: 'Preencha todos os campos.' }, this.closeNotification);
    }
  }

  closeNotification () {
    this.setState({ message: null });
  }
  
  render() {
    return (
      <div className="login hero is-fullheight">
        <div className="hero-body">
          <div className="container">

            <div className="compress">
                <h1 className="title is-clearfix">
                    <span>IBM Cognitive Clipping</span>
                </h1>

                <form className="form" onSubmit={this.authenticate}>
                    <div className="field">
                    <label htmlFor="username" className="label">Usuário</label>
                    <p className="control">
                        <input id="email" className="input" type="email" onChange={this.handleChange} />
                    </p>
                    </div>

                    <div className="field">
                    <label htmlFor="password" className="label">Senha</label>
                    <p className="control">
                        <input id="password" className="input" type="password" onChange={this.handleChange} />
                    </p>
                    </div>

                    <div className="field is-clearfix">
                    <div className="control">
                        <button className="button is-pulled-right is-primary">Entrar</button>
                    </div>
                    </div>

                    <div>
                    {
                        this.state.message ?
                        <div className="notification is-danger">
                        <button className="delete" onClick={this.closeNotification}></button>
                        { this.state.message }
                        </div> : null
                    }
                    </div>
                </form>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default Login;

// <img src={watsonLogo} alt="Watson" style={{ width: '20%', float: 'left', marginTop: '-25px'}} />