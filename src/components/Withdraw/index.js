import React from 'react';

import './Withdraw.scss'

const Withdraw = ({ walletBalance, amountToWithdraw, rewardsClaimed, errorCode }) => {
    const [amount, setAmount] = React.useState('')

    return (
        <div className="withdraw">
            <div className="deposit__amount">
                <div className="deposit__amount-head">
                    <span>Enter Amount</span>
                    <span>Deposited: {walletBalance} (UNI-V2)</span>
                </div>
                <input type="number" value={amount} className="deposit__amount-input" placeholder="0.00" onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="withdraw__wrapper">
                <div className="deposit__rewards withdraw__rewards">
                    <div className="withdraw__rewards-wrapper">
                        <div className="deposit__rewards-title">Amount to Withdraw</div>
                        <div className="deposit__rewards-content">{amountToWithdraw || '0.00'} PION</div>
                    </div>
                </div>
                <div className="deposit__rewards withdraw__rewards">
                    <div className="withdraw__rewards-wrapper">
                        <div className="deposit__rewards-title">Rewards Claimed</div>
                        <div className="deposit__rewards-content">{rewardsClaimed || '0.00'} PION</div>
                    </div>
                </div>
            </div>
            <button className="deposit__btn btn btn--big" disabled={!amount || amount == '0' || errorCode}>Withdraw</button>
        </div>
    );
}

export default Withdraw;
