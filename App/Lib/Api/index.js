import axios from 'axios';
import apiConfig from './config';

export const get = (path, parameters = {}) => {
    // console.log('/Lib/Api/index.js :: GET :: ' + apiConfig.url + apiConfig[path]);
    // console.log(parameters);
    // parameters.updateCallback = new Date();
    return axios.get(apiConfig.url + apiConfig[path], { params: parameters })
        .then((response) => {
            console.log('/Lib/Api/index.js :: GET :: ' + path + ' :: Success!');
            return Promise.resolve(response);
        })
        .catch((err) => {
            console.log('/Lib/Api/index.js :: GET :: ' + path + ' :: Failed!');
            //console.log(err);
            return Promise.reject(err);
        });
};
export const post = (path, parameters = {}) => {
    // console.log('/Lib/Api/index.js :: POST :: ' + apiConfig.url + apiConfig[path]);
    // console.log(parameters);
    // parameters.updateCallback = new Date();
    // console.log(apiConfig[path]);
    return axios.post(apiConfig.url + apiConfig[path], parameters)
        .then((response) => {
            console.log('/Lib/Api/index.js :: POST :: ' + path + ' :: Success!');
            return Promise.resolve(response);
        })
        .catch((err) => {
            console.log('/Lib/Api/index.js :: POST :: ' + path + ' :: Failed!');
            console.log(err);
            return Promise.reject(err);
        });
};

export const upload = (path, parameters = {}) => {
    // console.log('/Lib/Api/index.js :: UPLOAD :: ' + apiConfig.url + apiConfig[path]);
    // parameters.updateCallback = new Date();
    const body = new FormData();
    body.append('file', parameters.file);
    return axios.post(apiConfig.url + apiConfig[path], body, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((response) => {
            console.log('/Lib/Api/index.js :: UPLOAD :: ' + path + ' :: Success!');
            return Promise.resolve(response);
        })
        .catch((err) => {
            console.log('/Lib/Api/index.js :: UPLOAD :: ' + path + ' :: Failed!');
            console.log(err);
            return Promise.reject(err);
        });
}

export const uploadByUri = (path, parameters = {}) => {
    // console.log('/Lib/Api/index.js :: UPLOAD :: ' + apiConfig.url + apiConfig[path]);
    // parameters.updateCallback = new Date();
    const body = new FormData();
    body.append('file', {
      uri : parameters.uri,
      type: parameters.type,
      name: parameters.name,
    });
    return axios.post(apiConfig.url + apiConfig[path], body)
        .then((response) => {
            console.log('/Lib/Api/index.js :: UPLOAD :: ' + path + ' :: Success!');
            return Promise.resolve(response);
        })
        .catch((err) => {
            console.log('/Lib/Api/index.js :: UPLOAD :: ' + path + ' :: Failed!');
            console.log(err);
            return Promise.reject(err);
        });
}

// 참조문서1: axios => https://github.com/mzabriskie/axios
