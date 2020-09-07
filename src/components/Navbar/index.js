import React from 'react';
import classNames from 'classnames';

import './Navbar.scss'

const Navbar = ({ onSelect, activeTab }) => {
    const tabs = ['SWAP', 'Stake']

    return (
        <div className="navbar">
            {
                tabs.map((item, index) => {
                    return <div key={index} className={classNames('navbar__item nav-item', {
                        'active': index === activeTab
                    })} onClick={() => { onSelect(index) }}>{item}</div>
                })
            }
        </div>
    );
}

export default Navbar;
