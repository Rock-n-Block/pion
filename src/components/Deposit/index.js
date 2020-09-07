import React from 'react';

import './Deposit.scss'

import RewardsImg from '../../assets/img/rewards-img.svg';

const Deposit = () => {
    return (
        <div className="deposit">
            <div className="deposit__amount">
                <div className="deposit__amount-head">
                    <span>Enter Amount</span>
                    <span>Wallet balance: 0.000000</span>
                </div>
                <input type="number" className="deposit__amount-input" placeholder="0.00" />
            </div>
            <div className="deposit__rewards">
                <img src={RewardsImg} alt="" />
                <div className="deposit__rewards-wrapper">
                    <div className="deposit__rewards-title">Your Estimated Rewards</div>
                    <div className="deposit__rewards-content">0.00 PION/month</div>
                </div>
            </div>
            <div className="deposit__btn btn btn--big">Deposit</div>
        </div>
    );
}

export default Deposit;
