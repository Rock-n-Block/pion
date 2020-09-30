import axios from 'axios';

export default {
    getHistory: () => axios.get('http://piondev.rocknblock.io/api/v1/statistic/')
}