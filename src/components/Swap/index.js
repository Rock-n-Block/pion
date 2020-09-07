import React from 'react';
import classNames from 'classnames';
import { Select } from 'antd';

import './Swap.scss'

import PionImg from '../../assets/img/tokens/pion.svg';
import PrizeImg from '../../assets/img/tokens/prize.svg';
import SwapImg from '../../assets/img/swap.svg';

const { Option } = Select;

const Swap = () => {
    const percentItems = [10, 25, 50, 75, 100]

    const [activePercent, setActivePercent] = React.useState(10)

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
                        <Select defaultValue="PION" className="swap__select-item" dropdownStyle={{ backgroundColor: '#1F1F1F' }}>
                            <Option value="PION" className="swap__select-option-box">
                                <div className="swap__select-option">
                                    <img src={PionImg} alt="" />
                                    <p>PION</p>
                                </div>
                            </Option>
                            <Option value="PRIZE" className="swap__select-option-box">
                                <div className="swap__select-option">
                                    <img src={PrizeImg} alt="" />
                                    <p>PRIZE</p>
                                </div>
                            </Option>
                        </Select>
                    </div>
                    <div className="swap__item-ratio">0 PION = $0 USD</div>
                </div>
                <img src={SwapImg} alt="" className="swap__img" />
                <div className="swap__item">
                    <div className="swap__item-input">
                        <p>Receive</p>
                        <input type="number" placeholder="0.00" />
                    </div>
                    <div className="swap__select">
                        <Select defaultValue="PRIZE" className="swap__select-item" dropdownStyle={{ backgroundColor: '#1F1F1F' }}>
                            <Option value="PION" className="swap__select-option-box">
                                <div className="swap__select-option">
                                    <img src={PionImg} alt="" />
                                    <p>PION</p>
                                </div>
                            </Option>
                            <Option value="PRIZE" className="swap__select-option-box">
                                <div className="swap__select-option">
                                    <img src={PrizeImg} alt="" />
                                    <p>PRIZE</p>
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
