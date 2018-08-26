import React, { Component } from 'react';
import axios from 'axios';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';

// redux related book keeping
import configureStore from './Store';

// Views
import Root from './Root';
import querystring from 'querystring';
const { persistor, store } = configureStore();

const onBeforeLift = () => {
  // take some action before the gate lifts
};

axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
axios.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
axios.defaults.headers.patch['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
axios.defaults.transformRequest = [function (data) {
    if (data instanceof FormData) return data;
    return querystring.stringify(data);
}];

class Setup extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate
          //loading={<Loading />}
          onBeforeLift={onBeforeLift}
          persistor={persistor}
        >
          <Root />
        </PersistGate>
      </Provider>
    );
  }
}

export default Setup;
