import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { Switch } from 'antd';

import { themeActions, userActions, modalActions } from '../../redux/actions';
import MetamaskService from '../../utils/web3';

import Logo from '../../assets/img/logo.svg';
import MetamaskImg from '../../assets/img/metamask.svg';
import MetamaskImgLight from '../../assets/img/metamask-light.svg';
import SunImg from '../../assets/img/moon.svg';
import MoonImg from '../../assets/img/sun.svg';

import './Header.scss'

const Header = (props) => {
    const history = useHistory()
    const dispatch = useDispatch()
    const { address, errorCode, lightTheme } = useSelector((state) => {
        return {
            address: state.user.address,
            errorCode: state.user.errorCode,
            lightTheme: state.theme.lightTheme
        }
    })

    const onChange = (checked) => {
        dispatch(themeActions.toggleTheme(!checked))
    }

    const getAccounts = () => {
        const metamask = new MetamaskService()

        metamask.getAccounts().then(res => {

            dispatch(userActions.setUserData(res))
            dispatch(modalActions.toggleModal(false))
        }).catch(err => {

            dispatch(userActions.setUserData(err))
            dispatch(modalActions.toggleModal(true))
        })
    }

    const handleLogoClick = () => {
        if (history.location.pathname === '/') {
            history.go()
        } else {
            history.push('/')
        }
    }


    return (
        <header className="header">
            <div className="header__row row">
                <div onClick={handleLogoClick}>
                    <img src={Logo} alt="" className="header__logo" />
                </div>
                <div className="header__wrapper">
                    {lightTheme ? <img src={MoonImg} alt="" /> : <img src={SunImg} alt="" />}
                    <Switch size="small" defaultChecked onChange={onChange} />
                    {errorCode ? <div className="header__login btn" onClick={getAccounts}>Connect</div> : ''}
                    {
                        !errorCode && address && <div className="header__metamask">
                            {lightTheme ? <img src={MetamaskImgLight} alt="" /> : <img src={MetamaskImg} alt="" />}
                            <span>{address}</span>
                        </div>
                    }
                </div>
            </div>
        </header>
    );
}

export default Header;
