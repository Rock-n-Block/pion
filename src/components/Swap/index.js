import React from 'react';
import classNames from 'classnames';
import { Select } from 'antd';
import { useSelector } from 'react-redux';
import MetamaskService from '../../utils/web3';
import ContractDetails from '../../utils/web3/contract-details';
import tokensDecimal from '../../utils/web3/decimals';

import './Swap.scss'

import PionImg from '../../assets/img/tokens/pion.svg';
import PrizeImg from '../../assets/img/tokens/prize.svg';
import SwapImg from '../../assets/img/swap.svg';
import SwapLightImg from '../../assets/img/swap-light.svg';

const { Option } = Select;

const Swap = () => {
    const [metamask, setMetamask] = React.useState(new MetamaskService())
    const [web3PionContract, setWeb3PionContract] = React.useState(metamask.getContract(
        ContractDetails.PION.ABI,
        ContractDetails.PION.ADDRESS
    ))
    const [web3UniPairContract, setWeb3UniPairContract] = React.useState(metamask.getContract(
        ContractDetails.UNI_PAIR.ABI,
        ContractDetails.UNI_PAIR.ADDRESS
    ))
    const [ratio, setRatio] = React.useState(0)

    const [formAmount, setFormAmount] = React.useState('')
    const [selectBaseValue, setSelectBaseValue] = React.useState('PION')
    const [selectQuoteValue, setSelectQuoteValue] = React.useState('PRIZE')
    const [swapMethod, setSwapMethod] = React.useState('buy')

    const percentItems = [10, 25, 50, 75, 100]

    const [activePercent, setActivePercent] = React.useState(10)


    const { lightTheme, address, errorCode } = useSelector((state) => {
        return {
            lightTheme: state.theme.lightTheme,
            address: state.user.address,
            errorCode: state.user.errorCode
        }
    });

    const onChangeBaseSelect = (token) => {
        token === 'PION' ? setSwapMethod('buy') : setSwapMethod('sell')
        setSelectBaseValue(token)

        setSelectQuoteValue((token !== 'PION' ? 'PION' : 'PRIZE'))
    }

    const onChangeQuoteSelect = (token) => {
        token !== 'PION' ? setSwapMethod('buy') : setSwapMethod('sell')
        setSelectQuoteValue(token)

        setSelectBaseValue((token !== 'PION' ? 'PION' : 'PRIZE'))
    }

    const onSwap = () => {
        metamask.checkAllowance(address, ContractDetails.PRIZE.ADDRESS, formAmount, web3PionContract, swapMethod)
            .then(res => {
                console.log(res)
                metamask.createTokenTransaction(formAmount, ContractDetails.PRIZE.ADDRESS, address, swapMethod)
                setFormAmount(0)
            })
            .catch(() => {
            })
    }

    React.useEffect(() => {
        web3UniPairContract.methods.getReserves()
            .call()
            .then(res => {
                setRatio(res['_reserve1'] / (res['_reserve0'] * Math.pow(10, tokensDecimal.PION)))
            })
            .catch(err => console.log(err))
    }, [])

    return (
        <div className="swap">
            <div className="swap__percent">
                {
                    percentItems.map((item, index) => {
                        return <div key={index} className={classNames('swap__percent-item nav-item', {
                            'active': activePercent === item
                        })} onClick={() => { setActivePercent(item) }}>{item}%</div>
                    })
                }
            </div>
            <div className="swap__box">

                <div className="swap__item">
                    <div className="swap__item-input">
                        <p>SWAP</p>
                        <input type="number" placeholder="0.00" value={formAmount} onChange={(e) => setFormAmount(e.target.value)} />
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
                    <div className="swap__item-ratio">1 PION = ${ratio} USD</div>
                </div>
                {
                    lightTheme ? <img src={SwapLightImg} alt="" className="swap__img" /> : <img src={SwapImg} alt="" className="swap__img" />
                }


                <div className="swap__item">
                    <div className="swap__item-input">
                        <p>Receive</p>
                        <input type="number" placeholder="0.00" value={formAmount} onChange={(e) => setFormAmount(e.target.value)} />
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
                    <div className="swap__item-ratio">1 PION = 1 PRIZE</div>
                </div>
                <button className="swap__btn btn btn--big" onClick={onSwap} disabled={formAmount == '0' || !formAmount || errorCode}>SWAP</button>
                <div className="swap__price">
                    <span>Price Block: </span>
                    <span>29410</span>
                </div>
            </div>
        </div>
    );
}

export default Swap;
