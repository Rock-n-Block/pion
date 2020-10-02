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
    const [web3UniContract, setWeb3UniContract] = React.useState(metamask.getContract(
        ContractDetails.UNI.ABI,
        ContractDetails.UNI.ADDRESS
    ))
    const [walletPionBalance, setWallePiontBalance] = React.useState(0)
    const [walletUniBalance, setWalleUniBalance] = React.useState(0)
    const [amountToWithdraw, setAmountToWithdraw] = React.useState(0)
    const [rewardsClaimed, setRewardsClaimed] = React.useState(0)
    const [totalRewards, setTotalRewards] = React.useState(0)
    const [totalDeposit, setTotalDeposit] = React.useState(0)
    const [lockedRewards, setLockedRewards] = React.useState(0)
    const [unlockedRewards, setUnlockedRewards] = React.useState(0)
    const [totalProgramDuration, setTotalProgramDuration] = React.useState(0)

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

    const { lightTheme, address, errorCode } = useSelector((state) => {
        return {
            lightTheme: state.theme.lightTheme,
            address: state.user.address,
            errorCode: state.user.errorCode
        }
    });

    const updateData = () => {

        web3PionContract.methods.balanceOf(address)
            .call()
            .then(res => {
                setWallePiontBalance(res / Math.pow(10, tokensDecimal.PION))
            })
            .catch(err => console.log(err))

        web3UniContract.methods.balanceOf(address)
            .call()
            .then(res => {
                setWalleUniBalance(res)
            })
            .catch(err => console.log(err))

        web3MesonContract.methods.totalStakedFor(address)
            .call()
            .then(res => {
                setAmountToWithdraw(res)
            })
            .catch(err => console.log(err))

        web3MesonContract.methods.updateAccounting()
            .call()
            .then(res => {
                setRewardsClaimed(res[5])
            })
            .catch(err => console.log(err))

        const totalLockedPromise = web3MesonContract.methods.totalLocked().call()
        const totalUnlockedPromise = web3MesonContract.methods.totalUnlocked().call()

        Promise.all([totalUnlockedPromise, totalLockedPromise]).then(values => {
            const total = +values[0] + +values[1]
            setTotalRewards(total)
        });

        web3MesonContract.methods.totalStaked()
            .call()
            .then(res => {
                setTotalDeposit(res)
            })
            .catch(err => console.log(err))

        web3MesonContract.methods.totalLocked()
            .call()
            .then(res => {
                setLockedRewards(res)
            })
            .catch(err => console.log(err))

        web3MesonContract.methods.totalUnlocked()
            .call()
            .then(res => {
                setUnlockedRewards(res)
            })
            .catch(err => console.log(err))

        web3MesonContract.methods.updateAccounting()
            .call()
            .then(res => {
                console.log(res)
                setTotalProgramDuration(res[4] / 86400)
            })
            .catch(err => console.log(err))
    }

    React.useEffect(() => {
        if (!errorCode) {
            updateData()
        }
    }, [])

    const onDeposit = (amount) => {
        web3MesonContract.methods.stake(amount, '0x0000000000000000000000000000000000000000')
            .call()
            .then(res => {
                if (!errorCode) {
                    updateData()
                }
            })
            .catch(err => console.log(err))
    }

    return (
        <div className="stake">
            {/* <div className="stake__inf">
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
            </div> */}
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
                {activeTab === 0 && <Deposit lightTheme={lightTheme} onDeposit={onDeposit} walletBalance={walletPionBalance} errorCode={errorCode} />}
                {activeTab === 1 &&
                    <Withdraw
                        lightTheme={lightTheme}
                        walletBalance={walletUniBalance}
                        amountToWithdraw={amountToWithdraw}
                        rewardsClaimed={rewardsClaimed}
                        errorCode={errorCode}
                    />
                }
                {activeTab === 2 &&
                    <Stats lightTheme={lightTheme}
                        totalRewards={totalRewards}
                        totalDeposit={totalDeposit}
                        lockedRewards={lockedRewards}
                        unlockedRewards={unlockedRewards}
                        totalProgramDuration={totalProgramDuration}
                    />
                }
            </div>
        </div>
    );
}

export default Stake;
