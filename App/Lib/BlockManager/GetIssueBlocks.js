
// API
import * as HttpApi from '../Api/index';

export const getIssueBlock = ( someobject ) => {
  console.log(someobject);
    return HttpApi.get('GET_BLOCK_ISSUE', someobject).then((response) => {
        return Promise.resolve(response.data);
    }).catch((err) => {
        // 실패하면 한번만 더 시도할 것
        return HttpApi.get('GET_BLOCK_ISSUE', {
            data: someobject,
        }).then((response) => {
            return Promise.resolve(response.data);
        }).catch((err) => {
            return Promise.reject(err);
        });
    });
};
