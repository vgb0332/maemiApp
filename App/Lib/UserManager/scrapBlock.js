
// API
import * as HttpApi from '../Api/index';

export const scrapBlock = ( someobject ) => {
  console.log(someobject);
    return HttpApi.post('SCRAP_BLOCK', someobject).then((response) => {
        return Promise.resolve(response.data);
    }).catch((err) => {
        // 실패하면 한번만 더 시도할 것
        return HttpApi.post('SCRAP_BLOCK', {
            data: someobject,
        }).then((response) => {
            return Promise.resolve(response.data);
        }).catch((err) => {
            return Promise.reject(err);
        });
    });
};

export const scrapCheck = ( someobject ) => {
  console.log(someobject);
    return HttpApi.post('SCRAP_CHECK', someobject).then((response) => {
        return Promise.resolve(response.data);
    }).catch((err) => {
        // 실패하면 한번만 더 시도할 것
        return HttpApi.post('SCRAP_CHECK', {
            data: someobject,
        }).then((response) => {
            return Promise.resolve(response.data);
        }).catch((err) => {
            return Promise.reject(err);
        });
    });
};

export const scrapCancel = ( someobject ) => {
  console.log(someobject);
    return HttpApi.post('SCRAP_CANCEL', someobject).then((response) => {
        return Promise.resolve(response.data);
    }).catch((err) => {
        // 실패하면 한번만 더 시도할 것
        return HttpApi.post('SCRAP_CANCEL', {
            data: someobject,
        }).then((response) => {
            return Promise.resolve(response.data);
        }).catch((err) => {
            return Promise.reject(err);
        });
    });
};
