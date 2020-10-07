import React from 'react';
import { useSelector } from 'react-redux';

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


    const { lightTheme, address, errorCode } = useSelector((state) => {
        return {
            lightTheme: state.theme.lightTheme,
            address: state.user.address,
            errorCode: state.user.errorCode
        }
    });

    const updateData = () => {
        if (address) {
            contractService.getPionBalance(address).then(balance => {
                setWalletBalance(balance)
            })
        }
    }

    const handleSendMax = () => {
        setAmount(walletBalance)
    }

    const onSwap = () => {
        console.log(amount)
        // contractService.checkAllowance(address, formAmount)
        //     .then(() => {
        //         contractService.createTokenTransaction(formAmount, address, swapMethod)
        //         setFormAmount(0)
        //     })
        //     .catch(() => {
        //         contractService.approveToken(address, (result) => {
        //             setIsApproving(false)
        //             setIsApproved(result)
        //         })
        //     })
    }
    const onApprove = () => {
        setIsApproving(true)

        contractService.approveToken(address, (result) => {
            setIsApproving(false)
            setIsApproved(result)
        })
    }

    React.useEffect(() => {
        if (address) {
            contractService.checkAllowance(address, 0)
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
                    <div className="v2__input">
                        <input max={walletBalance} type="number" className="deposit__amount-input" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
                        <div className="v2__max" onClick={handleSendMax}>Send Max</div>
                    </div>
                </div>
                <div className="v2__text">
                    Exchange your Pion v1 tokens for Pion v2 to start the interaction with the platform. The swap will take place in 4 rounds: you will receive 25% of Pion v2 immediately, the remaining 75% can be taken in equal parts - 25% each month from the date of the swap. The exact withdrawal dates will be indicated on the website.
                </div>
                {isApproved ? <button className="btn btn--big" onClick={onSwap} disabled={!amount || errorCode}>SWAP</button> :
                    <button className="btn btn--big" onClick={onApprove} disabled={isApproving}>
                        {isApproving && <img src={Spiner} alt="" />}
                        <span>{isApproving ? 'Waiting' : 'Approve'}</span>
                    </button>}
            </div>
            <PionV2Table lightTheme={lightTheme} />
        </div>
    );
}

export default PionV2;
