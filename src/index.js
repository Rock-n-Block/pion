import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import higherOrderMetamaskComponent from './HOC/MetamaskComponent';
import { Provider } from 'react-redux'
import store from './redux/store'

const WApp = higherOrderMetamaskComponent(App)

ReactDOM.render(
  <Provider store={store}>
    <WApp />
  </Provider>
  ,
  document.getElementById('root')
);
