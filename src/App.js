import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { Route, Link } from 'react-router-dom';

import { Header, Modal } from './components';
import { HomePage, PionV2Page } from './pages';
import MetamaskService from './utils/web3';
import { userActions, modalActions } from './redux/actions';

import './App.scss'

function App() {
  const dispatch = useDispatch();
  const lightTheme = useSelector(({ theme }) => theme.lightTheme);

  React.useEffect(() => {
    const metamask = new MetamaskService()

    setTimeout(() => {

      metamask.getAccounts().then(res => {
        dispatch(userActions.setUserData(res))
        dispatch(modalActions.toggleModal(false))
      }).catch(err => {

        dispatch(userActions.setUserData(err))
        dispatch(modalActions.toggleModal(true))
      })
    }, 500)
  })

  return (
    <div className={classNames('pion', {
      'lighttheme': lightTheme
    })}>
      <Header />
      <Route exact path="/" component={HomePage} />
      <Route exact path="/v2" component={PionV2Page} />
      <Route exact path="/">
        <Link to="/v2" className="pion__link">Swap Pion v1 to Pion v2 tokens</Link>
      </Route>


      <Modal />
    </div>
  );
}

export default App;
