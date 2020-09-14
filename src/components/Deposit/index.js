import React from 'react';

import './Deposit.scss'

import RewardsImg from '../../assets/img/rewards-img.svg';
import RewardsImgLight from '../../assets/img/rewards-img-light.svg';

const Deposit = ({ lightTheme, onDeposit, walletBalance }) => {
    const [amount, setAmount] = React.useState(0.00)

    const onBtnClick = () => {
        onDeposit(amount)
        setAmount(0.00)
    }

    return (
        <div className="deposit">
            <div className="deposit__amount">
                <div className="deposit__amount-head">
                    <span>Enter Amount</span>
                    <span>Wallet balance: {walletBalance}</span>
                </div>
                <input type="number" className="deposit__amount-input" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="deposit__rewards">
                {lightTheme ? <img src={RewardsImgLight} alt="" /> : <img src={RewardsImg} alt="" />}
                <div className="deposit__rewards-wrapper">
                    <div className="deposit__rewards-title">Your Estimated Rewards</div>
                    <div className="deposit__rewards-content">0.00 PION/month</div>
                </div>
            </div>
            <div className="deposit__btn btn btn--big" onClick={onBtnClick}>Deposit</div>
        </div>
    );
}

export default Deposit;
