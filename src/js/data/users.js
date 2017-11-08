import axios from 'axios';
import { requestInterceptor, responseInterceptor } from './auth';

const API = 'https://cognitive-clipping-orchestrator.mybluemix.net';

axios.interceptors.request.use(requestInterceptor);
axios.interceptors.response.use(responseInterceptor);

var get = () => {
    const endpoint = API + '/users/load';

    return new Promise(function (resolve, reject) {
        axios.get(endpoint)
            .then(
            response => {
                resolve(response.data.data);
            })
            .catch(
            error => {
                console.error(error);
                reject(error);
            }
            );
    });
}

var create = (user) => {
    const endpoint = API + '/users/create';

    return new Promise(function (resolve, reject) {
        axios({
            method: 'post',
            url: endpoint,
            data: user
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

var remove = (user) => {
    const endpoint = API + '/users/delete';

    return new Promise(function (resolve, reject) {
        axios({
            method: 'post',
            url: endpoint,
            data: user
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

var update = (user) => {
    const endpoint = API + '/users/update';

    return new Promise(function (resolve, reject) {
        axios({
            method: 'post',
            url: endpoint,
            data: user
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
    get: get,
    create: create,
    update: update,
    remove: remove
};
