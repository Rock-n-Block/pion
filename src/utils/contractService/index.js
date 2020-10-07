import MetamaskService from '../web3';
import ContractDetails from '..//web3/contract-details';
import tokensDecimal from '..//web3/decimals';

class ContractService {
    metamaskService;

    pionContract;
    uniPairContract;
    prizeContract;
    uniContract;
    mesonContract;
    uniV2Contract



    constructor() {
        this.metamaskService = new MetamaskService()
        this.pionContract = this.metamaskService.getContract(ContractDetails.PION.ABI, ContractDetails.PION.ADDRESS)
        this.uniPairContract = this.metamaskService.getContract(ContractDetails.UNI_PAIR.ABI, ContractDetails.UNI_PAIR.ADDRESS)
        this.prizeContract = this.metamaskService.getContract(ContractDetails.PRIZE.ABI, ContractDetails.PRIZE.ADDRESS)
        this.uniContract = this.metamaskService.getContract(ContractDetails.UNI.ABI, ContractDetails.UNI.ADDRESS)
        this.mesonContract = this.metamaskService.getContract(ContractDetails.MESON.ABI, ContractDetails.MESON.ADDRESS)
        this.uniV2Contract = this.metamaskService.getContract(ContractDetails.UNI_V2.ABI, ContractDetails.UNI_V2.ADDRESS)
    }

    getReservesUniPair = () => {
        return new Promise((resolve, reject) => {
            this.uniPairContract.methods.getReserves()
                .call()
                .then(res => {
                    resolve(res['_reserve1'] / (res['_reserve0'] * Math.pow(10, tokensDecimal.PION)))
                })
                .catch(err => reject(err))
        })
    }

    getUniV2Balance = (address) => {
        return new Promise((resolve, reject) => {
            this.uniV2Contract.methods.balanceOf(address)
                .call()
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        })
    }


    getPionBalance = (address) => {
        return new Promise((resolve, reject) => {
            this.pionContract.methods.balanceOf(address)
                .call()
                .then(res => {
                    resolve(res / Math.pow(10, tokensDecimal.PION))
                })
                .catch(err => reject(err))
        })
    }

    getUniPairBalance = (address) => {
        return new Promise((resolve, reject) => {
            this.uniPairContract.methods.balanceOf(address)
                .call()
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        })
    }

    getPrizeBalance = (address) => {
        return new Promise((resolve, reject) => {
            this.prizeContract.methods.balanceOf(address)
                .call()
                .then(res => {
                    resolve(res / Math.pow(10, tokensDecimal.PION))
                })
                .catch(err => reject(err))
        })
    }

    getUniBalance = (address) => {
        return new Promise((resolve, reject) => {
            this.uniContract.methods.balanceOf(address)
                .call()
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        })
    }

    totalStakedFor = (address) => {
        return new Promise((resolve, reject) => {
            this.mesonContract.methods.totalStakedFor(address)
                .call()
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        })
    }

    updateAccounting = (address) => {
        return new Promise((resolve, reject) => {
            this.mesonContract.methods.updateAccounting(address)
                .call()
                .then(res => {
                    resolve(res[5])
                })
                .catch(err => reject(err))
        })
    }

    totalStaked = () => {
        return new Promise((resolve, reject) => {
            this.mesonContract.methods.totalStaked()
                .call()
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        })
    }

    updateAccounting = () => {
        return new Promise((resolve, reject) => {
            this.mesonContract.methods.updateAccounting()
                .call()
                .then(res => {
                    resolve(res[4] / 86400)
                })
                .catch(err => reject(err))
        })
    }

    calculateRewardFor = (address) => {
        return new Promise((resolve, reject) => {
            this.mesonContract.methods.calculateRewardFor(address)
                .call()
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        })
    }

    stake = (amount) => {
        return new Promise((resolve, reject) => {
            this.mesonContract.methods.stake(amount, '0x0000000000000000000000000000000000000000')
                .call()
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        })
    }


    totalLocked = () => {
        return this.mesonContract.methods.totalLocked().call()
    }

    totalUnlocked = () => {
        return this.mesonContract.methods.totalUnlocked().call()
    }


    approveToken = (address, collback) => {
        this.metamaskService.approveToken(address, ContractDetails.PRIZE.ADDRESS, collback)
    }

    checkAllowance = (address, amount) => {
        return new Promise((resolve, reject) => {
            this.metamaskService.checkAllowance(address, ContractDetails.PRIZE.ADDRESS, amount, this.pionContract)
                .then(() => {
                    resolve()
                })
                .catch(() => {
                    reject()
                })
        })
    }

    createTokenTransaction = (amount, address, swapMethod) => {
        this.metamaskService.createTokenTransaction(amount, ContractDetails.PRIZE.ADDRESS, address, swapMethod)
    }

}

export default ContractService