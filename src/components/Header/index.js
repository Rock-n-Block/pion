import React from 'react';

import Logo from '../../assets/img/logo.svg';

import './Header.scss'

const Header = () => {
    return (
        <header className="header">
            <div className="header__row row">
                <img src={Logo} alt="" className="header__logo" />
                <div className="header__login btn">Connect</div>
            </div>
        </header>
    );
}

export default Header;
