import React from 'react';
import { InputNumber } from 'antd';
import BigNumber from "bignumber.js"

import './Withdraw.scss'

const Withdraw = ({ walletBalance, rewardsClaimed, errorCode, reward, onWithdraw, handleCalculateWithdrawReward, calculatedWithdrawReward }) => {
    const [amount, setAmount] = React.useState('')

    const handleInputChange = (value) => {
        setAmount(value)

        handleCalculateWithdrawReward(value)
    }

    const handleSendMax = () => {
        setAmount(walletBalance)

        handleCalculateWithdrawReward(walletBalance)
    }

    const handleWithdraw = () => {
        onWithdraw(amount)
        setAmount('')
    }
    window.BigNumber = BigNumber
    return (
        <div className="withdraw">
            <div className="deposit__amount">
                <div className="deposit__amount-head">
                    <span>Enter Amount</span>
                    <span>Deposited: {BigNumber(walletBalance).toFixed()} (UNI-V2)</span>
                </div>
                <div className="deposit__box">
                    <InputNumber type="number" value={amount} max={walletBalance} min={0} className="deposit__amount-input" placeholder="0.00" onChange={handleInputChange} />
                    <div className="deposit__max" onClick={handleSendMax}>Send Max</div>
                </div>
            </div>
            <div className="withdraw__wrapper">
                <div className="deposit__rewards withdraw__rewards">
                    <div className="withdraw__rewards-wrapper">
                        <div className="deposit__rewards-title">Accrued Reward</div>
                        <div className="deposit__rewards-content">{(amount ? calculatedWithdrawReward : reward) || '0.00'} PION</div>
                    </div>
                </div>
                <div className="deposit__rewards withdraw__rewards">
                    <div className="withdraw__rewards-wrapper">
                        <div className="deposit__rewards-title">Rewards Claimed</div>
                        <div className="deposit__rewards-content">{rewardsClaimed || '0.00'} PION</div>
                    </div>
                </div>
            </div>
            <button className="deposit__btn btn btn--big" onClick={handleWithdraw} disabled={!amount || amount == '0' || errorCode || amount > walletBalance}>Withdraw</button>
        </div>
    );
}

export default Withdraw;
