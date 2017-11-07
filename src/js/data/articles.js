import axios from 'axios';
import { requestInterceptor, responseInterceptor } from './auth';

const API = 'https://dev-starkbot-mk2.mybluemix.net';

axios.interceptors.request.use(requestInterceptor);
axios.interceptors.response.use(responseInterceptor);

const getProfile = () => {
  const endpoint = API + '/profile/load';

  return new Promise(function (resolve, reject) {
    axios.get(endpoint)
      .then(
      response => {
        if (response.data.data.length > 0) {
          resolve(
            response.data.data
          );
        } else {
          resolve();
        }
      })
      .catch(
      error => {
        console.error(error);
        reject(error);
      }
      );
  });
}

const status = () => {
  const endpoint = API + '/crawler/status';

  return new Promise(function (resolve, reject) {
    axios.get(endpoint)
      .then(
      response => {
        if (response.data.status) {
          resolve(
            response.data.data
          );
        } else {
          resolve();
        }
      })
      .catch(
      error => {
        console.error(error);
        reject(error);
      }
      );
  });
}

const start = (profile) => {
  const endpoint = API + '/crawler/start';

  return new Promise(function (resolve, reject) {
    axios.post(endpoint, profile)
      .then(
      response => {

        if (response.data.status) {
          resolve(
            response.data.instances
          );
        } else {
          resolve();
        }
      })
      .catch(
      error => {
        console.error(error);
        reject(error);
      }
      );
  });
}

const stop = (profile) => {
  const endpoint = API + '/crawler/stop';

  return new Promise(function (resolve, reject) {
    axios.post(endpoint, profile)
      .then(
      response => {

        if (response.data.status) {
          resolve(
            response.data.instances
          );
        } else {
          resolve();
        }
      })
      .catch(
      error => {
        console.error(error);
        reject(error);
      }
      );
  });
}

export default {
  getProfile: getProfile,
  status: status,
  start: start,
  stop: stop
}
