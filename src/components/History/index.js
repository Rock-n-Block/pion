import React from 'react';
import classNames from 'classnames';
import format from 'date-fns/format'
import { Pagination } from 'antd';

import { historyApi } from '../../utils/api';

import './History.scss'

import arrowActiveImg from '../../assets/img/history-arrow-active.svg';
import arrowImg from '../../assets/img/history-arrow.svg';
import supplyUpImg from '../../assets/img/supply-up.svg';
import supplyDownImg from '../../assets/img/supply-down.svg';

const History = () => {

    const [isSorting, setIsSorting] = React.useState(true)
    const [items, setItems] = React.useState([])
    const [pagesCount, setPagesCount] = React.useState(0)
    const [currentPage, setCurrentPage] = React.useState(1)


    const handleSort = () => {
        setIsSorting(!isSorting)
    }

    const dateFormat = (date) => {
        return format(new Date(date * 1000), 'd.MM.Y hh:mm')
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
        getHistory(page)
    }

    const getHistory = (page = 1) => {

        historyApi.getHistory(page).then(({ data }) => {
            setItems(data.data)
            setPagesCount(data.pages)
        })
            .catch(err => console.log(err))
    }

    React.useEffect(() => {
        getHistory()
    }, [])

    return (
        <div className="history">
            <div className="history__head history__box">
                <div onClick={handleSort} className={classNames('history__head-item history__head-item-date', {
                    'active': isSorting
                })}>
                    <span>Date</span>
                    {
                        isSorting ? <img src={arrowActiveImg} alt="" /> : <img src={arrowImg} alt="" />
                    }
                </div>
                <div className="history__head-item">Total supply</div>
                <div className="history__head-item">Token price</div>
                <div className="history__head-item">CPI</div>
            </div>
            <div className="history__content">
                {
                    items && items.sort((item1, item2) => {
                        return isSorting ? item2.date - item1.date : item1.date - item2.date
                    }).map((item, index) => {
                        return <div key={index} className="history__item history__box">
                            <div className="history__item-date">{dateFormat(item.date)}</div>
                            <div className="history__item-supply">
                                {
                                    item.raised ? <img src={supplyUpImg} alt="" /> : item.raised === null ? <div className="history__empty"></div> : <img src={supplyDownImg} alt="" />
                                }
                                {(item.total_supply / Math.pow(10, 9)).toFixed(2)}
                            </div>
                            <div className="history__item-price">$ {(item.usd_price / Math.pow(10, 18)).toFixed(2)}</div>
                            <div className="history__item-сpi">{(item.cpi_value / Math.pow(10, 18)).toFixed(3)}</div>
                        </div>
                    })
                }
                {pagesCount > 1 && <div className="history__pages">
                    <Pagination current={currentPage} onChange={handlePageChange} total={pagesCount * 10} />
                </div>}
            </div>
        </div>
    );
}

export default History;
