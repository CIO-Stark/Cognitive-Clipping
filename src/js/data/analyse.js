import axios from 'axios';
import { requestInterceptor, responseInterceptor } from './auth';

const API = 'https://cognitive-clipping-orchestrator.mybluemix.net';
const moment = require('moment');

axios.interceptors.request.use(requestInterceptor);
axios.interceptors.response.use(responseInterceptor);

var analyse = (filter) => {
    const endpoint = API + '/orchestrator/data';

    return new Promise(function (resolve, reject) {
        axios.post(endpoint, filter)
            .then(
            response => {
                response.data.data.forEach(function (element) {
                    element.date = moment(element.date).format('YYYY-MM-DD');
                }, this);
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

var correlation = (filter) => {
    const endpoint = 'https://cognitive-clipping-orchestrator.mybluemix.net/orchestrator/correlation';
    //const endpoint = 'http://localhost:6023/orchestrator/correlation';

    return new Promise(function (resolve, reject) {
        axios.post(endpoint, filter)
            .then(
            response => {
                console.log(response.data);
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


export default {
    analyse: analyse,
    correlation: correlation
};