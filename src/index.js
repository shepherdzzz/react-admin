import React from 'react';
import ReactDOM from 'react-dom';
import storageUtils from './utils/storageUtils'
import memoryUtils from './utils/memoryUtils'

import App from './App';

const user = storageUtils.getUser()
if (user && user._id) {
    memoryUtils.user = user
}
ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

