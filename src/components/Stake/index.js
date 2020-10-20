import React from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import ContractService from '../../utils/contractService';
import tokensDecimal from '../../utils/web3/decimals';

import { Deposit, Withdraw, Stats } from '../../components';

import './Stake.scss'
import decimals from '../../utils/web3/decimals';

const Stake = () => {

    const [contractService] = React.useState(new ContractService())

    const [walletUniV2Balance, setWalleUniV2Balance] = React.useState(0)
    const [amountToWithdraw, setAmountToWithdraw] = React.useState(0)
    const [rewardsClaimed, setRewardsClaimed] = React.useState(0)
    const [totalRewards, setTotalRewards] = React.useState(0)
    const [totalDeposit, setTotalDeposit] = React.useState(0)
    const [lockedRewards, setLockedRewards] = React.useState(0)
    const [unlockedRewards, setUnlockedRewards] = React.useState(0)
    const [totalProgramDuration, setTotalProgramDuration] = React.useState(0)
    const [accruedReward, setAccruedReward] = React.useState('0.00')
    const [estimateMaxReward, setEstimateMaxReward] = React.useState('0.00')
    const [calculatedWithdrawReward, setCalculatedWithdrawReward] = React.useState('0.00')

    const [isDepositAllowance, setIsDepositAllowance] = React.useState(false)
    const [isDepositAllowancing, setIsDepositAllowancing] = React.useState(false)

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
        contractService.checkUniAllowance(address, 0).then(res => setIsDepositAllowance(res)).catch(err => setIsDepositAllowance(err))
        contractService.getUniV2Balance(address)
            .then(res => {
                setWalleUniV2Balance(res)
            })
            .catch(err => console.log(err))

        contractService.totalStakedFor(address)
            .then(res => {
                setAmountToWithdraw(res)
                calculateRewardFor(res / Math.pow(10, decimals.UNI_V2))
                    .then(res => {
                        setAccruedReward(res)
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))

        contractService.totalRewardsClaimed(address)
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
    }

    const calculateRewardFor = (amount) => {
        return contractService.calculateRewardFor(address, (amount * Math.pow(10, decimals.UNI_V2)))
    }

    React.useEffect(() => {
        if (!errorCode) {
            updateData()
        }
    }, [])

    const onDeposit = (amount) => {
        contractService.createTokenTransaction({
            data: amount,
            address,
            swapMethod: 'stake',
            contractName: 'MESON',
            callback: () => {
                setTimeout(() => {
                    updateData()
                }, 1000)
            },
            stake: '0x0000000000000000000000000000000000000000'
        })
    }

    const onWithdraw = (amount) => {
        contractService.createTokenTransaction({
            data: amount,
            address,
            swapMethod: 'unstake',
            contractName: 'MESON',
            callback: () => {
                setTimeout(() => {
                    updateData()
                }, 1000)
            },
            stake: '0x0000000000000000000000000000000000000000'
        })
    }

    const handleDepositApprove = () => {
        setIsDepositAllowancing(true)

        contractService.approveUniToken(address, (result) => {
            setIsDepositAllowancing(false)
            setIsDepositAllowance(result)
        })
    }

    const handleEstimateMaxReward = (amount) => {
        contractService.estimateMaxReward(amount * Math.pow(10, decimals.UNI_V2))
            .then(res => {
                setEstimateMaxReward(res)
            })
            .catch(() => setEstimateMaxReward('0.00'))
    }

    const handleCalculateWithdrawReward = (amount) => {
        calculateRewardFor(amount)
            .then(res => {
                setCalculatedWithdrawReward(res)
            })
            .catch((err) => {
                console.log(err)
                setCalculatedWithdrawReward('0.00')
            })
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
                        walletBalance={walletUniV2Balance / Math.pow(10, decimals.UNI_V2)}
                        errorCode={errorCode}
                        isApproved={isDepositAllowance}
                        isApproving={isDepositAllowancing}
                        handleApprove={handleDepositApprove}
                        handleEstimateMaxReward={handleEstimateMaxReward}
                        estimateMaxReward={estimateMaxReward / Math.pow(10, decimals.PION)}
                    />
                }
                {activeTab === 1 &&
                    <Withdraw
                        lightTheme={lightTheme}
                        walletBalance={amountToWithdraw / Math.pow(10, decimals.UNI_V2)}
                        reward={accruedReward / Math.pow(10, decimals.PION)}
                        rewardsClaimed={rewardsClaimed / Math.pow(10, decimals.PION)}
                        errorCode={errorCode}
                        onWithdraw={onWithdraw}
                        handleCalculateWithdrawReward={handleCalculateWithdrawReward}
                        calculatedWithdrawReward={calculatedWithdrawReward / Math.pow(10, decimals.PION)}
                    />
                }
                {activeTab === 2 &&
                    <Stats lightTheme={lightTheme}
                        totalRewards={totalRewards / Math.pow(10, decimals.UNI_V2)}
                        totalDeposit={totalDeposit / Math.pow(10, decimals.UNI_V2)}
                        lockedRewards={lockedRewards / Math.pow(10, decimals.UNI_V2)}
                        unlockedRewards={unlockedRewards}
                        totalProgramDuration={totalProgramDuration}
                    />
                }
            </div>
        </div>
    );
}

export default Stake;
