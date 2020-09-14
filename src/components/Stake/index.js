import React from 'react';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import MetamaskService from '../../utils/web3';
import ContractDetails from '../../utils/web3/contract-details';
import tokensDecimal from '../../utils/web3/decimals';

import { Deposit, Withdraw, Stats } from '../../components';

import './Stake.scss'

import TooltipImg from '../../assets/img/tooltip.svg';
import TooltipImgLight from '../../assets/img/tooltip-light.svg';

const Stake = () => {

    const [metamask, setMetamask] = React.useState(new MetamaskService())
    const [web3PionContract, setWeb3PionContract] = React.useState(metamask.getContract(
        ContractDetails.PION.ABI,
        ContractDetails.PION.ADDRESS
    ))
    const [web3MesonContract, setWeb3MesonContract] = React.useState(metamask.getContract(
        ContractDetails.MESON.ABI,
        ContractDetails.MESON.ADDRESS
    ))
    const [walletBalance, setWalletBalance] = React.useState(0)

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

    const lightTheme = useSelector(({ theme }) => theme.lightTheme);

    React.useEffect(() => {

        web3PionContract.methods.balanceOf('0x68E0C1dBF926cDa7A65ef2722e046746EB0f816f')
            .call()
            .then(res => {
                setWalletBalance(res / Math.pow(10, tokensDecimal.PION))
            })
            .catch(err => console.log(err))
    }, [])

    const onDeposit = (amount) => {
        web3MesonContract.methods.stake(amount, '0x0000000000000000000000000000000000000000')
            .call()
            .then(res => {
                console.log(res)
            })
            .catch(err => console.log(err))
    }

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
                                    {lightTheme ? <img src={TooltipImgLight} alt="" /> : <img src={TooltipImg} alt="" />}
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
                {activeTab === 0 && <Deposit lightTheme={lightTheme} onDeposit={onDeposit} walletBalance={walletBalance} />}
                {activeTab === 1 && <Withdraw lightTheme={lightTheme} />}
                {activeTab === 2 && <Stats lightTheme={lightTheme} />}
            </div>
        </div>
    );
}

export default Stake;
