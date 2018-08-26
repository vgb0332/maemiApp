
// API
import * as HttpApi from '../Api/index';

export const saveBlock = ( someobject ) => {
  console.log(someobject);
    return HttpApi.post('SAVE_BLOCK', someobject).then((response) => {
        return Promise.resolve(response.data);
    }).catch((err) => {
        // 실패하면 한번만 더 시도할 것
        return HttpApi.post('SAVE_BLOCK', {
            data: someobject,
        }).then((response) => {
            return Promise.resolve(response.data);
        }).catch((err) => {
            return Promise.reject(err);
        });
    });
};
