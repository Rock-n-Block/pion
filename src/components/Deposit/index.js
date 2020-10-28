import React from 'react';
import { InputNumber, Input } from 'antd';
import BigNumber from "bignumber.js"

import './Deposit.scss'

import RewardsImg from '../../assets/img/rewards-img.svg';
import RewardsImgLight from '../../assets/img/rewards-img-light.svg';
import Spiner from '../../assets/img/oval.svg';

const Deposit = ({ lightTheme, onDeposit, walletBalance, errorCode, isApproved, isApproving, handleApprove, handleEstimateMaxReward, estimateMaxReward }) => {
    const [amount, setAmount] = React.useState('')

    const handleDepositClick = () => {
        onDeposit(amount)
        setAmount(0.00)
    }

    const handleSendMax = () => {
        setAmount(walletBalance)
        handleEstimateMaxReward(walletBalance)
    }

    const handleChangeValue = (value) => {
        setAmount(value)

        handleEstimateMaxReward('' + value)
    }
    window.bignumber = BigNumber
    return (
        <div className="deposit">
            <div className="deposit__amount">
                <div className="deposit__amount-head">
                    <span>Enter Amount</span>
                    <span>Wallet balance: {BigNumber(walletBalance).toFixed()}</span>
                </div>
                <div className="deposit__box">
                    <InputNumber type="number" className="deposit__amount-input" min={0} placeholder="0.00" value={amount} onChange={handleChangeValue} />
                    <div className="deposit__max" onClick={handleSendMax}>Send Max</div>
                </div>
            </div>
            <div className="deposit__rewards">
                {lightTheme ? <img src={RewardsImgLight} alt="" /> : <img src={RewardsImg} alt="" />}
                <div className="deposit__rewards-wrapper">
                    <div className="deposit__rewards-title">Your Estimated Max Rewards</div>
                    <div className="deposit__rewards-content">{estimateMaxReward} PION</div>
                </div>
            </div>
            {isApproved ? <button className="deposit__btn btn btn--big" onClick={handleDepositClick} disabled={!amount || amount == '0' || errorCode || amount > walletBalance || amount < 0}>Deposit</button> :
                <button className="btn btn--big" onClick={handleApprove} disabled={isApproving}>
                    {isApproving && <img src={Spiner} alt="" />}
                    <span>{isApproving ? 'Waiting' : 'Approve'}</span>
                </button>}
        </div>
    );
}

export default Deposit;
