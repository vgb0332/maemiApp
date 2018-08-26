
// API
import * as HttpApi from '../Api/index';

export const follow = ( someobject ) => {
    return HttpApi.post('USER_FOLLOW', someobject).then((response) => {
        return Promise.resolve(response.data);
    }).catch((err) => {
        // 실패하면 한번만 더 시도할 것
        return HttpApi.post('USER_FOLLOW', {
            data: someobject,
        }).then((response) => {
            return Promise.resolve(response.data);
        }).catch((err) => {
            return Promise.reject(err);
        });
    });
};

export const unfollow = ( someobject ) => {
    return HttpApi.post('USER_UNFOLLOW', someobject).then((response) => {
        return Promise.resolve(response.data);
    }).catch((err) => {
        // 실패하면 한번만 더 시도할 것
        return HttpApi.post('USER_UNFOLLOW', {
            data: someobject,
        }).then((response) => {
            return Promise.resolve(response.data);
        }).catch((err) => {
            return Promise.reject(err);
        });
    });
};


export const followCheck = ( someobject ) => {
    return HttpApi.post('USER_FOLLOW_CHECK', someobject).then((response) => {
        return Promise.resolve(response.data);
    }).catch((err) => {
        // 실패하면 한번만 더 시도할 것
        return HttpApi.post('USER_FOLLOW_CHECK', {
            data: someobject,
        }).then((response) => {
            return Promise.resolve(response.data);
        }).catch((err) => {
            return Promise.reject(err);
        });
    });
};
