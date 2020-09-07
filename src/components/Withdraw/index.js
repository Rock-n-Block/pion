import React from 'react';

import './Withdraw.scss'

const Withdraw = () => {
    return (
        <div className="withdraw">
            <div className="deposit__amount">
                <div className="deposit__amount-head">
                    <span>Enter Amount</span>
                    <span>Deposited: 0.000000 (UWETHAMPL-V2)</span>
                </div>
                <input type="number" className="deposit__amount-input" placeholder="0.00" />
            </div>
            <div className="withdraw__wrapper">
                <div className="deposit__rewards withdraw__rewards">
                    <div className="withdraw__rewards-wrapper">
                        <div className="deposit__rewards-title">Amount to Withdraw</div>
                        <div className="deposit__rewards-content">0.00 PION</div>
                    </div>
                </div>
                <div className="deposit__rewards withdraw__rewards">
                    <div className="withdraw__rewards-wrapper">
                        <div className="deposit__rewards-title">Rewards Claimed</div>
                        <div className="deposit__rewards-content">0.00 PION</div>
                    </div>
                </div>
            </div>
            <div className="deposit__btn btn btn--big">Withdraw</div>
        </div>
    );
}

export default Withdraw;
