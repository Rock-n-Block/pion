import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';

import { Header, Navbar, Swap, Stake, Modal } from './components';
import MetamaskService from './utils/web3';
import { userActions, modalActions } from './redux/actions';

import './App.scss'

function App() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = React.useState(0)

  const onSelect = (tabIndex) => {
    setActiveTab(tabIndex)
  }

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
      <div className="pion__content">
        <Navbar activeTab={activeTab} onSelect={onSelect} />
        {
          activeTab === 0 && <Swap />
        }
        {
          activeTab === 1 && <Stake />
        }
      </div>
      <Modal />
    </div>
  );
}

export default App;
