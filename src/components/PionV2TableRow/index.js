import React from 'react';
import { Tooltip } from 'antd';
import BigNumber from "bignumber.js"
import format from 'date-fns/format'
import classNames from 'classnames';

import decimals from '../../utils/web3/decimals';

import isOkImg from '../../assets/img/isOk.svg';
import isOkImgLight from '../../assets/img/isOkLight.svg';

const PionV2TableRow = ({ item, lightTheme, handleWithdraw }) => {

    const [isWithdraw, setIsWithdraw] = React.useState(false)

    const dateFormat = (date) => {
        return format(new Date(date * 1000), 'dd.MM.Y')
    }
    const numberWithCommas = (number) => {
        var parts = number.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

    const dateCompare = (date) => {
        return date * 1000 < new Date().getTime()
    }

    React.useEffect(() => {
        item.items.map(elem => {
            if (dateCompare(elem.date)) {
                setIsWithdraw(true)
            }
        })
    })

    return (
        <div className="v2-table__item">
            <div className="v2-table__item-head">
                <div className="v2-table__item-elem">
                    <p>Deposit</p>
                    <span className="bold">{dateFormat(item.deposit)}</span>
                </div>
                <div className="v2-table__item-elem">
                    <p>Amount</p>
                    <span className="bold">{item.amount && numberWithCommas(item.amount / Math.pow(10, decimals.PION))}</span>
                </div>
                <div className="v2-table__item-elem">
                    <p>25%</p>
                    <span className="bold">{item.percent && numberWithCommas(item.percent / Math.pow(10, decimals.PION))}</span>
                </div>
            </div>
            <div className="v2-table__item-content">
                {item.items &&
                    item.items.map((elem, index) => {
                        return <div key={index} className={classNames('v2-table__box', {
                            'active': elem.date * 1000 < new Date().getTime()
                        })}>
                            <div className="v2-table__item-elem">
                                <p>Date</p>
                                <span>{dateFormat(elem.date)}</span>
                            </div>
                            <div className="v2-table__item-elem" id="v2-table__item-elem">
                                <p>25%</p>
                                <Tooltip
                                    placement="bottom"
                                    title={numberWithCommas(BigNumber(elem.percent / Math.pow(10, decimals.PION)).toFixed())}
                                    getPopupContainer={() => document.getElementById('v2-table__item-elem')}
                                >
                                    <span>{numberWithCommas(BigNumber(elem.percent / Math.pow(10, decimals.PION)).toFixed().split('').splice(0, 10).join(''))}</span>
                                </Tooltip>
                            </div>
                        </div>
                    })
                }
                <button disabled={!isWithdraw} onClick={() => handleWithdraw(item.address)} className={classNames('v2-table__item-btn', {
                    'active': +item.amount === +item.withdrawAmount
                })}>
                    {!lightTheme && +item.amount === +item.withdrawAmount && <img src={isOkImg} />}
                    {lightTheme && +item.amount === +item.withdrawAmount && <img src={isOkImgLight} />}
                    <span>Withdraw</span>
                </button>
            </div>
        </div>
    );
}

export default PionV2TableRow;
