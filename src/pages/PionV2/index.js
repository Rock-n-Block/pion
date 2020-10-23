import React from 'react';
import { useSelector } from 'react-redux';
import { InputNumber } from 'antd';
import BigNumber from "bignumber.js"

import ContractService from '../../utils/contractService';
import { PionV2Table } from '../../components';

import './PionV2.scss'

import swapImg from '../../assets/img/swap-icon.svg';
import swapImgLight from '../../assets/img/swap-icon-light.svg';
import Spiner from '../../assets/img/oval.svg';

const PionV2 = () => {
    const [contractService] = React.useState(new ContractService())

    const [walletBalance, setWalletBalance] = React.useState('0.000000')
    const [amount, setAmount] = React.useState('')
    const [isApproved, setIsApproved] = React.useState(true)
    const [isApproving, setIsApproving] = React.useState(false)

    const [swapsData, setSwapsData] = React.useState([])


    const { lightTheme, address, errorCode } = useSelector((state) => {
        return {
            lightTheme: state.theme.lightTheme,
            address: state.user.address,
            errorCode: state.user.errorCode
        }
    });

    const updateData = () => {
        const tableData = []
        if (address) {
            contractService.getPionV1Balance(address).then(balance => {
                setWalletBalance(balance)
            })

            contractService.swapPeriod()
                .then(time => {
                    contractService.getUserSwaps(address)
                        .then(res => {
                            const promiseItems = res.map(item => contractService.swapsById(item))

                            Promise.all([...promiseItems]).then(values => {
                                values.map((result, index) => {
                                    const dataItem = {
                                        address: res[index],
                                        amount: result.totalAmount,
                                        deposit: result.initialTime,
                                        withdrawAmount: result.withdrawnAmount,
                                        percent: (result.totalAmount / 4),
                                        items: [
                                            {
                                                date: +result.initialTime + +time,
                                                percent: (result.totalAmount / 4),
                                            },
                                            {
                                                date: +result.initialTime + +time * 2,
                                                percent: (result.totalAmount / 4),
                                            },
                                            {
                                                date: +result.initialTime + +time * 3,
                                                percent: (result.totalAmount / 4),
                                            },
                                        ]
                                    }
                                    tableData.push(dataItem)
                                })
                                setSwapsData(tableData.reverse())
                            });


                        })
                        .catch(err => console.log(err))
                })
                .catch(err => console.log(err))

        }
    }

    const handleSendMax = () => {
        setAmount(walletBalance)
    }

    const onSwap = () => {
        contractService.createTokenTransaction({
            data: amount,
            address,
            swapMethod: 'swapTokens',
            contractName: 'PION_SWAP',
            callback: () => {
                updateData()
            }
        })
        setAmount('')
    }
    const onApprove = () => {
        setIsApproving(true)

        contractService.approveSwapV1ToV2(address, (result) => {
            setIsApproving(false)
            setIsApproved(result)
        })
    }

    const handleWithdraw = (swapId) => {
        contractService.createTokenTransaction({
            data: swapId, address,
            swapMethod: 'withdrawRemainingTokens',
            contractName: 'PION_SWAP',
            callback: () => {
                updateData()
            },
            withdraw: true
        })
    }

    React.useEffect(() => {
        if (address) {
            contractService.checkSwapAllowance(address, 0)
                .then(res => {
                    setIsApproved(res)
                })
                .catch(() => {
                    setIsApproved(false)
                })
        }
        if (!errorCode) {
            updateData()
        }
    }, [address])

    return (
        <div className="v2">
            <div className="v2__title">
                <span>Swap Pion v1</span>
                {lightTheme ? <img src={swapImgLight} alt="" /> : <img src={swapImg} alt="" />}
                <span>Pion v2 tokens</span>
            </div>
            <div className="v2__box">

                <div className="deposit__amount">
                    <div className="deposit__amount-head">
                        <span>Enter Amount</span>
                        <span>Wallet balance: {walletBalance}</span>
                    </div>
                    <div className="v2__input deposit__box">
                        <InputNumber pattern="[0-9]" max={walletBalance} type="number" className="deposit__amount-input" placeholder="0.00" value={amount} onChange={(value) => setAmount(value)} />
                        <div className="v2__max" onClick={handleSendMax}>Send Max</div>
                    </div>
                </div>
                <div className="v2__text">
                    Exchange your Pion v1 tokens for Pion v2 to start the interaction with the platform. The swap will take place in 4 rounds: you will receive 25% of Pion v2 immediately, the remaining 75% can be taken in equal parts - 25% each month from the date of the swap. The exact withdrawal dates will be indicated on the website.
                </div>
                {isApproved ? <button className="btn btn--big" onClick={onSwap} disabled={!amount || errorCode || amount > walletBalance || (BigNumber(amount).toFixed().split('.')[1] && BigNumber(amount).toFixed().split('.')[1].length > 8)
                }>SWAP</button> :
                    <button className="btn btn--big" onClick={onApprove} disabled={isApproving}>
                        {isApproving && <img src={Spiner} alt="" />}
                        <span>{isApproving ? 'Waiting' : 'Approve'}</span>
                    </button>}
            </div>
            <PionV2Table lightTheme={lightTheme} data={swapsData} handleWithdraw={handleWithdraw} />
        </div>
    );
}

export default PionV2;
