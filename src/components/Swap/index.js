import React from 'react';
import classNames from 'classnames';
import { Select, InputNumber } from 'antd';
import { useSelector } from 'react-redux';
import ContractService from '../../utils/contractService';

import './Swap.scss'

import PionImg from '../../assets/img/tokens/pion.svg';
import PrizeImg from '../../assets/img/tokens/prize.svg';
import SwapImg from '../../assets/img/swap.svg';
import SwapLightImg from '../../assets/img/swap-light.svg';
import Spiner from '../../assets/img/oval.svg';

const { Option } = Select;

const Swap = () => {
    const [contractService] = React.useState(new ContractService())

    const [ratio, setRatio] = React.useState(0)

    const [formAmount, setFormAmount] = React.useState('')
    const [selectBaseValue, setSelectBaseValue] = React.useState('PION')
    const [selectQuoteValue, setSelectQuoteValue] = React.useState('PRIZE')
    const [swapMethod, setSwapMethod] = React.useState('buy')

    const [isApproved, setIsApproved] = React.useState(true)
    const [isApproving, setIsApproving] = React.useState(false)

    const [pionWalletBalance, setPionWalletBalance] = React.useState(0)
    const [prizeWalletBalance, setPrizeWalletBalance] = React.useState(0)

    const percentItems = [10, 25, 50, 75, 100]

    const [activePercent, setActivePercent] = React.useState(0)


    const { lightTheme, address, errorCode } = useSelector((state) => {
        return {
            lightTheme: state.theme.lightTheme,
            address: state.user.address,
            errorCode: state.user.errorCode
        }
    });

    const handleChangePercent = (percent, activeToken) => {
        const method = (activeToken || selectBaseValue) === 'PION' ? contractService.getPionBalance : contractService.getPrizeBalance
        setActivePercent(percent)
        method(address).then((balance) => {
            const newAmount = percent ? (balance * percent / 100).toFixed(9) : ''
            setFormAmount(+newAmount ? +newAmount : '')
            return
        })
    }

    const handleMoveTokens = () => {
        const baseToken = selectBaseValue
        const quoteToken = selectQuoteValue

        setSelectQuoteValue(baseToken)
        setSelectBaseValue(quoteToken)

        selectBaseValue === 'PRIZE' ? setSwapMethod('buy') : setSwapMethod('sell')
        handleChangePercent(activePercent, quoteToken)
    }

    const onChangeBaseSelect = (token) => {
        token === 'PION' ? setSwapMethod('buy') : setSwapMethod('sell')
        setSelectBaseValue(token)

        setSelectQuoteValue((token !== 'PION' ? 'PION' : 'PRIZE'))

        handleChangePercent(activePercent, token)
    }

    const onChangeQuoteSelect = (token) => {
        token !== 'PION' ? setSwapMethod('buy') : setSwapMethod('sell')
        setSelectQuoteValue(token)

        setSelectBaseValue((token !== 'PION' ? 'PION' : 'PRIZE'))
        handleChangePercent(activePercent, (token !== 'PION' ? 'PION' : 'PRIZE'))
    }

    const onSwap = () => {
        contractService.createTokenTransaction({ data: formAmount, address, swapMethod: swapMethod })
        setFormAmount(0)
        setActivePercent(0)
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
            contractService.getPionBalance(address).then((balance) => {
                setPionWalletBalance(balance.toFixed(9))
            })
            contractService.getPrizeBalance(address).then((balance) => {
                setPrizeWalletBalance(balance.toFixed(9))
            })
        }

        contractService.getAmountsOut()
            .then(res => {
                setRatio(res)
            })
            .catch(err => {
                console.log(err)
            })



    }, [address])

    return (
        <div className="swap">
            <div className="swap__percent">
                {
                    percentItems.map((item, index) => {
                        return <div key={index} className={classNames('swap__percent-item nav-item', {
                            'active': activePercent === item
                        })} onClick={() => { handleChangePercent(item) }}>{item}%</div>
                    })
                }
            </div>
            <div className="swap__box">

                <div className="swap__item">
                    <div className="swap__item-input">
                        <p>SWAP</p>
                        <input type="number" placeholder="0.00" value={formAmount} onChange={(e) => {
                            setFormAmount(e.target.value)
                            setActivePercent(0)
                        }} />
                    </div>
                    <div className="swap__select">
                        <Select value={selectBaseValue} className="swap__select-item" onChange={onChangeBaseSelect} dropdownStyle={lightTheme ? { backgroundColor: '#F1F6FC' } : { backgroundColor: '#1F1F1F' }}>
                            <Option value="PION" className={classNames({
                                'swap__select-option-box': !lightTheme,
                                'swap__select-option-box-lighttheme': lightTheme
                            })}>
                                <div className="swap__select-option">
                                    <img src={PionImg} alt="" />
                                    <p className={classNames({ 'swap__select-option-text-light': lightTheme, 'swap__select-option-text': !lightTheme })}>PION</p>
                                </div>
                            </Option>
                            <Option value="PRIZE" className={classNames({
                                'swap__select-option-box': !lightTheme,
                                'swap__select-option-box-lighttheme': lightTheme
                            })}>
                                <div className="swap__select-option">
                                    <img src={PrizeImg} alt="" />
                                    <p className={classNames({ 'swap__select-option-text-light': lightTheme, 'swap__select-option-text': !lightTheme })}>PRIZE</p>
                                </div>
                            </Option>
                        </Select>
                    </div>
                    <div className="swap__item-ratio">1 PION = ${ratio.toString().slice(9)} USD</div>
                </div>
                {
                    lightTheme ? <img src={SwapLightImg} alt="" className="swap__img" onClick={handleMoveTokens} /> : <img src={SwapImg} alt="" className="swap__img" onClick={handleMoveTokens} />
                }


                <div className="swap__item">
                    <div className="swap__item-input">
                        <p>Receive</p>
                        <input type="number" placeholder="0.00" value={formAmount} onChange={(e) => {
                            setFormAmount(e.target.value)
                            setActivePercent(0)
                        }} />
                    </div>
                    <div className="swap__select">
                        <Select value={selectQuoteValue} onChange={onChangeQuoteSelect} className="swap__select-item" dropdownStyle={lightTheme ? { backgroundColor: '#F1F6FC' } : { backgroundColor: '#1F1F1F' }}>
                            <Option value="PION" className={classNames({
                                'swap__select-option-box': !lightTheme,
                                'swap__select-option-box-lighttheme': lightTheme
                            })}>
                                <div className="swap__select-option">
                                    <img src={PionImg} alt="" />
                                    <p className={classNames({ 'swap__select-option-text-light': lightTheme, 'swap__select-option-text': !lightTheme })}>PION</p>
                                </div>
                            </Option>
                            <Option value="PRIZE" className={classNames({
                                'swap__select-option-box': !lightTheme,
                                'swap__select-option-box-lighttheme': lightTheme
                            })}>
                                <div className="swap__select-option">
                                    <img src={PrizeImg} alt="" />
                                    <p className={classNames({ 'swap__select-option-text-light': lightTheme, 'swap__select-option-text': !lightTheme })}>PRIZE</p>
                                </div>
                            </Option>
                        </Select>
                    </div>
                    <div className="swap__item-ratio">1 PION = 1 PRIZE (fee 2%)</div>
                </div>
                {isApproved ? <button className="swap__btn btn btn--big" onClick={onSwap}
                    disabled={formAmount == '0' || !formAmount || errorCode || (selectBaseValue === 'PION' ? (formAmount > pionWalletBalance) : (formAmount > prizeWalletBalance))}
                >SWAP</button> :
                    <button className="swap__btn btn btn--big" onClick={onApprove} disabled={isApproving}>
                        {isApproving && <img src={Spiner} alt="" />}
                        <span>{isApproving ? 'Waiting' : 'Approve'}</span>
                    </button>}
            </div>
        </div>
    );
}

export default Swap;
