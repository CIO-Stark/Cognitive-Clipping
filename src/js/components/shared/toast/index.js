import React, { Component } from 'react';
import * as ToastService from './toast_service';

class Toast extends Component {

  constructor(props, context) {
    super(props, context);
    
    this.state = {
      notifications: [],
      isActive: false
    };

    this.pushNotification = this.pushNotification.bind(this);
    this.removeNotification = this.removeNotification.bind(this);
  }

  componentDidMount () {
    ToastService.subscribe('open', this.pushNotification);

    // let self = this;
    // setTimeout(() => {
    //   let notifications = this.state.notifications;

    //   setTimeout(() => {
    //     self.pushNotification('Erro ao gravar os dados. Tente mais tarde', 'danger');
    //   }, 1000);

    //   setTimeout(() => {
    //     self.pushNotification('Falha ao salvar o arquivo.', 'warning');
    //   }, 2000);

    //   setTimeout(() => {
    //     self.pushNotification('Dado salvo com sucesso!', 'success');
    //   }, 3000);
    // });
  }
  
  pushNotification (message, type, time) {
    let notifications = this.state.notifications;

    notifications.push({ message, type });

    this.setState({ notifications, isActive: true }, this.removeNotification);
  }

  removeNotification (time) {
    setTimeout(() => {
      let isActive = this.state.isActive;
      let notifications = this.state.notifications;

      notifications.shift();

      if (!notifications.length) {
        isActive = false;
      }

      this.setState({ notifications, isActive });
    }, time || 5000);
  }

  resolveNotificationType (type) {
    switch (type) {
      case 'warning': return 'is-warning';
      case 'success': return 'is-success';
      case 'danger': return 'is-danger';
      default: return 'is-info';
    }
  }

  render() {
    return (
      <div className={'toast-container' + (this.state.isActive ? ' is-active': '') } >
        {
          this.state.notifications.map((notification, index) => {
            const className = 'notification ' + this.resolveNotificationType(notification.type);

            return (
              <div key={index} className={className}>
                <p>{ notification.message }</p>
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default Toast;