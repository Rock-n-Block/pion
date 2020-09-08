import React from 'react';
import classNames from 'classnames';
import { Select } from 'antd';
import { useSelector } from 'react-redux';

import './Swap.scss'

import PionImg from '../../assets/img/tokens/pion.svg';
import PrizeImg from '../../assets/img/tokens/prize.svg';
import SwapImg from '../../assets/img/swap.svg';
import SwapLightImg from '../../assets/img/swap-light.svg';

const { Option } = Select;

const Swap = () => {
    const percentItems = [10, 25, 50, 75, 100]

    const [activePercent, setActivePercent] = React.useState(10)


    const lightTheme = useSelector(({ theme }) => theme.lightTheme);

    return (
        <div className="swap">
            <div className="swap__percent">
                {
                    percentItems.map((item, index) => {
                        return <div key={index} className={classNames('swap__percent-item nav-item', {
                            'active': activePercent === item
                        })} onClick={() => { setActivePercent(item) }}>{item}%</div>
                    })
                }
            </div>
            <div className="swap__box">

                <div className="swap__item">
                    <div className="swap__item-input">
                        <p>SWAP</p>
                        <input type="number" placeholder="0.00" />
                    </div>
                    <div className="swap__select">
                        <Select defaultValue="PION" className="swap__select-item" dropdownStyle={lightTheme ? { backgroundColor: '#F1F6FC' } : { backgroundColor: '#1F1F1F' }}>
                            <Option value="PION" className={classNames({
                                'swap__select-option-box': !lightTheme,
                                'swap__select-option-box-lighttheme': lightTheme
                            })}>
                                <div className="swap__select-option">
                                    <img src={PionImg} alt="" />
                                    <p className={classNames({ 'swap__select-option-text-light': lightTheme, 'swap__select-option-text': !lightTheme })}>PION</p>
                                </div>
                            </Option>
                            <Option value="PRIZE" className={classNames({
                                'swap__select-option-box': !lightTheme,
                                'swap__select-option-box-lighttheme': lightTheme
                            })}>
                                <div className="swap__select-option">
                                    <img src={PrizeImg} alt="" />
                                    <p className={classNames({ 'swap__select-option-text-light': lightTheme, 'swap__select-option-text': !lightTheme })}>PRIZE</p>
                                </div>
                            </Option>
                        </Select>
                    </div>
                    <div className="swap__item-ratio">0 PION = $0 USD</div>
                </div>
                {
                    lightTheme ? <img src={SwapLightImg} alt="" className="swap__img" /> : <img src={SwapImg} alt="" className="swap__img" />
                }


                <div className="swap__item">
                    <div className="swap__item-input">
                        <p>Receive</p>
                        <input type="number" placeholder="0.00" />
                    </div>
                    <div className="swap__select">
                        <Select defaultValue="PRIZE" className="swap__select-item" dropdownStyle={lightTheme ? { backgroundColor: '#F1F6FC' } : { backgroundColor: '#1F1F1F' }}>
                            <Option value="PION" className={classNames({
                                'swap__select-option-box': !lightTheme,
                                'swap__select-option-box-lighttheme': lightTheme
                            })}>
                                <div className="swap__select-option">
                                    <img src={PionImg} alt="" />
                                    <p className={classNames({ 'swap__select-option-text-light': lightTheme, 'swap__select-option-text': !lightTheme })}>PION</p>
                                </div>
                            </Option>
                            <Option value="PRIZE" className={classNames({
                                'swap__select-option-box': !lightTheme,
                                'swap__select-option-box-lighttheme': lightTheme
                            })}>
                                <div className="swap__select-option">
                                    <img src={PrizeImg} alt="" />
                                    <p className={classNames({ 'swap__select-option-text-light': lightTheme, 'swap__select-option-text': !lightTheme })}>PRIZE</p>
                                </div>
                            </Option>
                        </Select>
                    </div>
                    <div className="swap__item-ratio">1 PION = 1 PRIZE</div>
                </div>
                <div className="swap__btn btn btn--big">SWAP</div>
                <div className="swap__price">
                    <span>Price Block: </span>
                    <span>29410</span>
                </div>
            </div>
        </div>
    );
}

export default Swap;
