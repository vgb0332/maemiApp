import { AsyncStorage } from 'react-native';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';

// Reducer
import { reducer as dataReducer } from './Modules/index';


const config = {
    key: 'root',
    storage,
};

const rootReducer = combineReducers({
    data: persistReducer(config, dataReducer)
});

function configureStore() {
    // ...
    const store = createStore(
        rootReducer,
        undefined,
        compose(applyMiddleware(thunk)),
    );
    const persistor = persistStore(store);

    return { persistor, store };
}

export default configureStore;
