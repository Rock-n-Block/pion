import React from 'react';

import './Stats.scss'

const Stats = () => {
    return (
        <div className="stats">
            <div className="stats__item">
                <div className="stats__item-head">Total Rewards</div>
                <div className="stats__item-content">5,018,050.99 PION</div>
            </div>
            <div className="stats__item">
                <div className="stats__item-head">Total Deposits</div>
                <div className="stats__item-content">1,070,037.90 USD</div>
            </div>
            <div className="stats__item">
                <div className="stats__item-head">Locked Rewards</div>
                <div className="stats__item-content">2,024,048.55 PION</div>
            </div>
            <div className="stats__item">
                <div className="stats__item-head">Unlocked Rewards</div>
                <div className="stats__item-content">2,994,002.44 PION</div>
            </div>
            <div className="stats__item">
                <div className="stats__item-head">Total Program duration</div>
                <div className="stats__item-content">36.3 days left</div>
            </div>
            <div className="stats__item">
                <div className="stats__item-head">Total Reward unlock rate</div>
                <div className="stats__item-content">1,670,795.25 PION / month</div>
            </div>
        </div>
    );
}

export default Stats;
