import React from 'react';

import { PionV2TableRow } from '../../components';

import './PionV2Table.scss'

const PionV2Table = ({ lightTheme, data, handleWithdraw }) => {

    return (
        <div className="v2-table">
            { data &&
                data.map((item, index) => {
                    return <PionV2TableRow handleWithdraw={handleWithdraw} key={index} lightTheme={lightTheme} item={item} />
                })
            }
        </div>
    );
}

export default PionV2Table;
