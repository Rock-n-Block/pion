import React from 'react';
import { Tooltip } from 'antd';
import classNames from 'classnames';

import { Deposit, Withdraw, Stats } from '../../components';

import './Stake.scss'

import TooltipImg from '../../assets/img/tooltip.svg';

const Stake = () => {

    const infItems = [
        {
            title: 'APY',
            content: '153.85%',
            tooltip: 'text'
        },
        {
            title: 'Reward Muitiplier',
            content: '1.0x',
            tooltip: 'text'
        },
        {
            title: 'Accrued Reward',
            content: '0.00',
            tooltip: 'text'
        },
    ]

    const tabs = ['Deposit', 'Withdraw', 'Stats']

    const [activeTab, setActiveTab] = React.useState(0)

    return (
        <div className="stake">
            <div className="stake__inf">
                {
                    infItems.map((item, index) => {
                        return (

                            <div className="stake__inf-item" key={index}>
                                <div className="stake__inf-item-title">{item.title}</div>
                                <div className="stake__inf-item-content">
                                    {item.content}
                                    {index === 2 ? <span> PION</span> : ''}
                                </div>
                                <Tooltip placement="top" title={item.tooltip} className="stake__inf-item-tooltip">
                                    <img src={TooltipImg} alt="" />
                                </Tooltip>
                            </div>
                        )
                    })
                }
            </div>
            <div className="stake__navbar">
                {
                    tabs.map((tab, index) => <div key={index} onClick={() => { setActiveTab(index) }} className={classNames('stake__navbar-tab nav-item', {
                        'active': index === activeTab
                    })}>
                        {tab}
                    </div>)
                }
            </div>
            <div className="stake__content">
                {activeTab === 0 && <Deposit />}
                {activeTab === 1 && <Withdraw />}
                {activeTab === 2 && <Stats />}
            </div>
        </div>
    );
}

export default Stake;
