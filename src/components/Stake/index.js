import React from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import MetamaskService from '../../utils/web3';
import ContractService from '../../utils/contractService';
import ContractDetails from '../../utils/web3/contract-details';
import tokensDecimal from '../../utils/web3/decimals';

import { Deposit, Withdraw, Stats } from '../../components';

import './Stake.scss'

const Stake = () => {

    const [contractService] = React.useState(new ContractService())

    const [walletPionBalance, setWallePiontBalance] = React.useState(0)
    const [walletUniBalance, setWalleUniBalance] = React.useState(0)
    const [walletUniV2Balance, setWalleUniV2Balance] = React.useState(0)
    const [amountToWithdraw, setAmountToWithdraw] = React.useState(0)
    const [rewardsClaimed, setRewardsClaimed] = React.useState(0)
    const [totalRewards, setTotalRewards] = React.useState(0)
    const [totalDeposit, setTotalDeposit] = React.useState(0)
    const [lockedRewards, setLockedRewards] = React.useState(0)
    const [unlockedRewards, setUnlockedRewards] = React.useState(0)
    const [totalProgramDuration, setTotalProgramDuration] = React.useState(0)
    const [accruedReward, setAccruedReward] = React.useState('0.00')

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
        contractService.getUniV2Balance(address)
            .then(res => {
                setWalleUniV2Balance(res)
            })
            .catch(err => console.log(err))

        contractService.getPionBalance(address)
            .then(res => {
                setWallePiontBalance(res)
            })
            .catch(err => console.log(err))

        contractService.getUniBalance(address)
            .then(res => {
                setWalleUniBalance(res)
            })
            .catch(err => console.log(err))

        contractService.totalStakedFor(address)
            .then(res => {
                setAmountToWithdraw(res)
            })
            .catch(err => console.log(err))

        contractService.updateAccounting()
            .then(res => {
                setRewardsClaimed(res)
            })
            .catch(err => console.log(err))

        const totalLockedPromise = contractService.totalLocked()
        const totalUnlockedPromise = contractService.totalUnlocked()

        Promise.all([totalUnlockedPromise, totalLockedPromise]).then(values => {
            const total = +values[0] + +values[1]

            setLockedRewards(values[0])
            setUnlockedRewards(values[1])
            setTotalRewards(total)
        });

        contractService.totalStaked()
            .then(res => {
                setTotalDeposit(res)
            })
            .catch(err => console.log(err))

        contractService.updateAccounting()
            .then(res => {
                setTotalProgramDuration(res)
            })
            .catch(err => console.log(err))

        contractService.calculateRewardFor(address)
            .then(res => {
                setAccruedReward(res)
            })
            .catch(err => console.log(err))
    }

    React.useEffect(() => {
        if (!errorCode) {
            updateData()
        }
    }, [])

    const onDeposit = (amount) => {
        contractService.stake(amount)
            .then(() => {
                if (!errorCode) {
                    updateData()
                }
            })
            .catch(err => console.log(err))
    }

    return (
        <div className="stake">
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
                {activeTab === 0 &&
                    <Deposit
                        lightTheme={lightTheme}
                        onDeposit={onDeposit}
                        walletBalance={walletUniV2Balance}
                        errorCode={errorCode}
                        reward={accruedReward}
                    />
                }
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
