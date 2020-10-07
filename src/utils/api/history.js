import axios from 'axios';

export default {
    getHistory: (page) => axios.get(`http://piondev.rocknblock.io/api/v1/statistic/?page=${page}`)
}