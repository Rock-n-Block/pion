import React from 'react';

import './Deposit.scss'

import RewardsImg from '../../assets/img/rewards-img.svg';
import RewardsImgLight from '../../assets/img/rewards-img-light.svg';
import Spiner from '../../assets/img/oval.svg';

const Deposit = ({ lightTheme, onDeposit, walletBalance, errorCode, reward, isApproved, isApproving, handleApprove }) => {
    const [amount, setAmount] = React.useState('')

    const handleDepositClick = () => {
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
                    <div className="deposit__rewards-title">Accrued Reward</div>
                    <div className="deposit__rewards-content">{reward} PION</div>
                </div>
            </div>
            {/* <button className="deposit__btn btn btn--big" onClick={onBtnClick} disabled={!amount || amount == '0' || errorCode}>Deposit</button> */}
            {isApproved ? <button className="deposit__btn btn btn--big" onClick={handleDepositClick} disabled={!amount || amount == '0' || errorCode}>Deposit</button> :
                <button className="btn btn--big" onClick={handleApprove} disabled={isApproving}>
                    {isApproving && <img src={Spiner} alt="" />}
                    <span>{isApproving ? 'Waiting' : 'Approve'}</span>
                </button>}
        </div>
    );
}

export default Deposit;
