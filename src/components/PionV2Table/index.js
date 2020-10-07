import React from 'react';
import { Tooltip } from 'antd';
import BigNumber from "bignumber.js"
import classNames from 'classnames';

import './PionV2Table.scss'

import isOkImg from '../../assets/img/isOk.svg';
import isOkImgLight from '../../assets/img/isOkLight.svg';

const PionV2Table = ({ lightTheme }) => {
    window.bigNumber = BigNumber

    const numberWithCommas = (number) => {
        var parts = number.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

    const data = [
        {
            deposit: '28.05.2020',
            amount: 5000000,
            percent: 1018050.99,
            items: [
                {
                    date: '28.05.2020',
                    percent: 2000000525000000000000000000000
                },
                {
                    date: '28.05.2020',
                    percent: 2000000525000000000000000000000
                },
                {
                    date: '28.05.2020',
                    percent: 2000000525000000000000000000000
                },
            ]
        },
        {
            deposit: '28.05.2020',
            amount: 5000000,
            percent: 1018050.99,
            disabled: true,
            items: [
                {
                    date: '28.05.2020',
                    percent: 2000000525000000000000000000000
                },
                {
                    date: '28.05.2020',
                    percent: 2000000525000000000000000000000
                },
                {
                    date: '28.05.2020',
                    percent: 2000000525000000000000000000000
                },
            ]
        },
        {
            deposit: '28.05.2020',
            amount: 5000000,
            percent: 1018050.99,
            isOk: true,
            items: [
                {
                    date: '28.05.2020',
                    percent: 2000000525000000000000000000000
                },
                {
                    date: '28.05.2020',
                    percent: 2000000525000000000000000000000
                },
                {
                    date: '28.05.2020',
                    percent: 2000000525000000000000000000000
                },
            ]
        }
    ]

    return (
        <div className="v2-table">
            {
                data.map((item, index) => {
                    return <div key={index} className="v2-table__item">
                        <div className="v2-table__item-head">
                            <div className="v2-table__item-elem">
                                <p>Deposit</p>
                                <span className="bold">{item.deposit}</span>
                            </div>
                            <div className="v2-table__item-elem">
                                <p>Amount</p>
                                <span className="bold">{numberWithCommas(item.amount)}</span>
                            </div>
                            <div className="v2-table__item-elem">
                                <p>25%</p>
                                <span className="bold">{numberWithCommas(item.percent)}</span>
                            </div>
                        </div>
                        <div className="v2-table__item-content">
                            {
                                item.items.map((elem, index) => {
                                    return <div key={index} className="v2-table__box">
                                        <div className="v2-table__item-elem">
                                            <p>Date</p>
                                            <span>{elem.date}</span>
                                        </div>
                                        <div className="v2-table__item-elem" id="v2-table__item-elem">
                                            <p>25%</p>
                                            <Tooltip
                                                placement="bottom"
                                                title={numberWithCommas(BigNumber(elem.percent).toFixed())}
                                                getPopupContainer={() => document.getElementById('v2-table__item-elem')}
                                            >
                                                <span>{numberWithCommas(BigNumber(elem.percent).toFixed().split('').splice(0, 10).join(''))}</span>
                                            </Tooltip>
                                        </div>
                                    </div>
                                })
                            }
                            <button disabled={item.disabled} className={classNames('v2-table__item-btn', {
                                'active': item.isOk
                            })}>
                                {!lightTheme && item.isOk && <img src={isOkImg} />}
                                {lightTheme && item.isOk && <img src={isOkImgLight} />}
                                <span>Withdraw</span>
                            </button>
                        </div>
                    </div>
                })
            }
        </div>
    );
}

export default PionV2Table;
