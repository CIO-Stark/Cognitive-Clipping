import axios from 'axios';
import { requestInterceptor, responseInterceptor } from './auth';

const API = '//social-media-extractor.mybluemix.net/twitter';

axios.interceptors.request.use(requestInterceptor);
axios.interceptors.response.use(responseInterceptor);

let load = () => {
  const endpoint = API + '/load' + '?=' + new Date().getTime();

  return new Promise(function (resolve, reject) {
    axios({
      method: 'get',
      url: endpoint,
    })
      .then(
      response => {
        resolve(response.data);
      })
      .catch(
      error => {
        console.error(error);
        reject(error);
      }
      );
  });
}

let create = (entry) => {
  const endpoint = API + '/create';

  return new Promise(function (resolve, reject) {
    axios({
      method: 'post',
      url: endpoint,
      data: entry
    })
      .then(
      response => {
        resolve(response.data);
      })
      .catch(
      error => {
        console.error(error);
        reject(error);
      }
      );
  });
}

let update = (entry) => {
  const endpoint = API + '/update';

  return new Promise(function (resolve, reject) {
    axios({
      method: 'put',
      url: endpoint,
      data: entry
    })
      .then(
      response => {
        resolve(response.data);
      })
      .catch(
      error => {
        console.error(error);
        reject(error);
      }
      );
  });
}

let remove = (entry) => {
  const endpoint = API + '/remove';

  return new Promise(function (resolve, reject) {
    axios({
      method: 'delete',
      url: endpoint,
      data: entry
    })
      .then(
      response => {
        resolve(response.data);
      })
      .catch(
      error => {
        console.error(error);
        reject(error);
      }
      );
  });
}

let start = (entry) => {
  const endpoint = API + '/start';

  return new Promise(function (resolve, reject) {
    axios({
      method: 'post',
      url: endpoint,
      data: entry
    })
      .then(
      response => {
        resolve(response.data);
      })
      .catch(
      error => {
        console.error(error);
        reject(error);
      }
      );
  });
}

let stop = (entry) => {
  const endpoint = API + '/stop';

  return new Promise(function (resolve, reject) {
    axios({
      method: 'delete',
      url: endpoint,
      data: entry
    })
      .then(
      response => {
        resolve(response.data);
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
  load: load, // Get
  create: create, // Post
  update: update, // Put
  remove: remove, // Delete
  stop: stop, // Delete
  start: start // Post
};