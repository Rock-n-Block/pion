import React from 'react';

import { Header, Navbar, Swap, Stake } from './components';

import './App.scss'

function App() {
  const [activeTab, setActiveTab] = React.useState(0)

  const onSelect = (tabIndex) => {
    setActiveTab(tabIndex)
  }

  return (
    <div className="pion">
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
    </div>
  );
}

export default App;
