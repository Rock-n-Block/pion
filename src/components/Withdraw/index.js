import React from 'react';

import './Withdraw.scss'

const Withdraw = ({ walletBalance, withdrawReward, rewardsClaimed, errorCode, getAmountToWithdrow, onWithdraw }) => {
    const [amount, setAmount] = React.useState('')

    const handleInputChange = (e) => {
        getAmountToWithdrow(e.target.value)
        setAmount(e.target.value)
    }

    const handleSendMax = () => {
        setAmount(walletBalance)
    }


    return (
        <div className="withdraw">
            <div className="deposit__amount">
                <div className="deposit__amount-head">
                    <span>Enter Amount</span>
                    <span>Deposited: {walletBalance} (UNI-V2)</span>
                </div>
                <div className="deposit__box">
                    <input type="number" value={amount} className="deposit__amount-input" placeholder="0.00" onChange={handleInputChange} />
                    <div className="deposit__max" onClick={handleSendMax}>Send Max</div>
                </div>
            </div>
            <div className="withdraw__wrapper">
                <div className="deposit__rewards withdraw__rewards">
                    <div className="withdraw__rewards-wrapper">
                        <div className="deposit__rewards-title">Accrued Reward</div>
                        <div className="deposit__rewards-content">{withdrawReward || '0.00'} PION</div>
                    </div>
                </div>
                <div className="deposit__rewards withdraw__rewards">
                    <div className="withdraw__rewards-wrapper">
                        <div className="deposit__rewards-title">Rewards Claimed</div>
                        <div className="deposit__rewards-content">{rewardsClaimed || '0.00'} PION</div>
                    </div>
                </div>
            </div>
            <button className="deposit__btn btn btn--big" onClick={() => onWithdraw(amount)} disabled={!amount || amount == '0' || errorCode}>Withdraw</button>
        </div>
    );
}

export default Withdraw;
