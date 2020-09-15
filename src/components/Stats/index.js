import React from 'react';

import './Stats.scss'

const Stats = ({ totalRewards, totalDeposit, lockedRewards, unlockedRewards, totalProgramDuration }) => {
    return (
        <div className="stats">
            <div className="stats__item">
                <div className="stats__item-head">Total Rewards</div>
                <div className="stats__item-content">{totalRewards} PION</div>
            </div>
            <div className="stats__item">
                <div className="stats__item-head">Total Deposits</div>
                <div className="stats__item-content">{totalDeposit} USD</div>
            </div>
            <div className="stats__item">
                <div className="stats__item-head">Locked Rewards</div>
                <div className="stats__item-content">{lockedRewards} PION</div>
            </div>
            <div className="stats__item">
                <div className="stats__item-head">Unlocked Rewards</div>
                <div className="stats__item-content">{unlockedRewards} PION</div>
            </div>
            <div className="stats__item">
                <div className="stats__item-head">Total Program duration</div>
                <div className="stats__item-content">{totalProgramDuration} days left</div>
            </div>
            <div className="stats__item">
                <div className="stats__item-head">Total Reward unlock rate</div>
                <div className="stats__item-content">1,670,795.25 PION / month</div>
            </div>
        </div>
    );
}

export default Stats;
