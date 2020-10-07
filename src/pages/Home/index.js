import React from 'react';
import { Navbar, Swap, Stake, History } from '../../components';

const Home = () => {
    const [activeTab, setActiveTab] = React.useState(0)

    const onSelect = (tabIndex) => {
        setActiveTab(tabIndex)
    }

    return (
        <div className="pion__content">
            <Navbar activeTab={activeTab} onSelect={onSelect} />
            {
                activeTab === 0 && <Swap />
            }
            {
                activeTab === 1 && <Stake />
            }
            {
                activeTab === 2 && <History />
            }
        </div>
    );
}

export default Home;
