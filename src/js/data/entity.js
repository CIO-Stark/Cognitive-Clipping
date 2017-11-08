import axios from 'axios';
import { requestInterceptor, responseInterceptor } from './auth';

const API = 'https://cognitive-clipping-orchestrator.mybluemix.net';

axios.interceptors.request.use(requestInterceptor);
axios.interceptors.response.use(responseInterceptor);

var get = () => {
    const endpoint = API + '/entity/load';

    return new Promise(function (resolve, reject) {
        axios.get(endpoint)
            .then(
            response => {
                let entities = response.data.data.map((element) => {
                    return {
                        value: element.entity,
                        checked: false,
                        id: {
                            _id: element._id,
                            _rev: element._rev
                        }
                    }
                });
                if (entities.length > 0) {
                    resolve(entities);
                } else {
                    resolve('Não tem entidades')
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

var getContext = (entities) => {
    const endpoint = API + '/orchestrator/contexts';

    return new Promise(function (resolve, reject) {
        axios({
            method: 'post',
            url: endpoint,
            data: entities
        })
        .then(response => {
            let parsed = [];
            response = response.data.data;

            for (let i = 0; i < response.length; i++) {
                let entry = response[i];
                parsed.push( [entry.label, ...entry.data.map( context => ({ value: context, checked: false }))] );
            }

            resolve(parsed);
        })
        .catch(error => {
            console.error(error);
            reject(error);
        });
    });

}

var entityDelete = (id) => {
    const endpoint = API + '/entity/delete';

    return new Promise(function (resolve, reject) {
        axios({
            method: 'post',
            url: endpoint,
            data: id
        })
            .then(
            response => {
                resolve(response.data.status);
            })
            .catch(
            error => {
                console.error(error);
                reject(error);
            }
            );
    });

}

var entityCreate = (entity) => {
    const endpoint = API + '/entity/create';

    return new Promise(function (resolve, reject) {
        axios({
            method: 'post',
            url: endpoint,
            data: entity
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
    getContext: getContext,
    entityDelete: entityDelete,
    entityCreate: entityCreate
};
