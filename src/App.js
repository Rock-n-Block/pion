import React from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import { Header, Navbar, Swap, Stake, Modal } from './components';

import './App.scss'

function App({ getAccounts }) {
  const [activeTab, setActiveTab] = React.useState(0)

  const onSelect = (tabIndex) => {
    setActiveTab(tabIndex)
  }

  const lightTheme = useSelector(({ theme }) => theme.lightTheme);

  return (
    <div className={classNames('pion', {
      'lighttheme': lightTheme
    })}>
      <Header getAccounts={getAccounts} />
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
