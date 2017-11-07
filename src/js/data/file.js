import axios from 'axios';
import { requestInterceptor, responseInterceptor } from './auth';

import moment from 'moment';

const API = 'https://dev-filescavenger-mk2.mybluemix.net';

axios.interceptors.request.use(requestInterceptor);
axios.interceptors.response.use(responseInterceptor);

const get = () => {
    const endpoint = API + '/file/list';
    return new Promise(function (resolve, reject) {
        axios.get(endpoint)
        .then(response => {
            response = response.data;

            if (response.status) {
                resolve(response.data.map(file => {
                    file.upload_date = moment(file.upload_date).format('DD-MM-YYYY');
                    return file;
                }));
            } else {
                reject(new Error(response.message));
            }
        })
        .catch(error => {
            console.error(error);
            reject(error);
        });
    });
};

const remove = (file) => {
    const endpoint = API + '/file/remove';
    return new Promise(function (resolve, reject) {
        file.id = file._id;
        file.rev = file._rev;
        
        axios.post(endpoint, file)
        .then(response => {
            response = response.data;

            if (response.status) {
                resolve();
            } else {
                reject(new Error(response.message));
            }
        })
        .catch(error => {
            console.error(error);
            reject(error);
        });
    });
};

const create = (file) => {
    const endpoint = API + '/file/upload';
    return new Promise(function (resolve, reject) {
        axios.post(endpoint, file)
        .then(response => {
            response = response.data;
            
            if (response.status) {
                resolve();
            } else {
                reject(new Error(response.message));
            }
        })
        .catch(error => {
            console.error(error);
            reject(error);
        });
    });
};

export default {
    get: get,
    remove: remove,
    create: create
};