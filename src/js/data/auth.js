import axios from 'axios';

const JWT_TOKEN = 'jwtToken';
const USER_ROLE = 'userInfo';
const API = 'https://presentation-cognitive-clipping-orchestrator.mybluemix.net/auth/login';

let user = null;

export function authenticate (user) {
    if (!user.mail && !user.password) {
        throw new Error('Informações para autencicação insuficientes.');
    }
    
    return new Promise ((resolve, reject) => {
        axios.post(API, user)
        .then(response => {
            response = response.data;

            if (response.status) {
                localStorage.setItem(JWT_TOKEN, response.token);
                localStorage.setItem(USER_ROLE, response.user.role);
                resolve({ status: response.status });
            } else {
                reject({ status: response.status, message: 'Credenciais inválidas' }); 
            }
        })
        .catch(error => {
           reject(error); 
        });
    });
}

export function isAdmin () {
    return localStorage.getItem(USER_ROLE);
}

// export function isAuthenticated () {
//     return true;
// }

export function getAuthToken () {
    return localStorage.getItem(JWT_TOKEN);
}

export function requestInterceptor (config) {
    //config.headers['x-access-token'] = 'Bearer ' + exports.getAuthToken();
    return config;
}

export function responseInterceptor (response) {
    if (!response.data.status && response.data.code == 401) {
        console.log('unauthoried access');
    }
    return response;
}