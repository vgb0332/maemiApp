
// API
import * as HttpApi from '../Api/index';

export const createReplyBlock = ( someobject ) => {
  console.log(someobject);
    return HttpApi.post('POST_BLOCK_REPLY', someobject).then((response) => {
        return Promise.resolve(response.data);
    }).catch((err) => {
        // 실패하면 한번만 더 시도할 것
        return HttpApi.upload('POST_BLOCK_REPLY', {
            data: someobject,
        }).then((response) => {
            return Promise.resolve(response.data);
        }).catch((err) => {
            return Promise.reject(err);
        });
    });
};
