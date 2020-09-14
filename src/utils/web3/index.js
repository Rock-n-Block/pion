import Web3 from 'web3';
import ContractDetails from './contract-details';


const IS_PRODUCTION = false;

const WEB3_CONSTANTS = {
    ropsten: {
        WEB3_PROVIDER: 'https://ropsten.infura.io/v3/e65462856a9b46fbbec5d0fde337f2b0'
    }
};


const networks = {
    production: 'mainnet',
    testnet: 'ropsten'
};

class MetamaskService {

    metaMaskWeb3;
    providers;
    Web3Provider;

    constructor() {
        this.providers = {};
        this.providers.metamask = Web3.givenProvider;
        this.providers.infura = new Web3.providers.HttpProvider(
            WEB3_CONSTANTS[networks[IS_PRODUCTION ? 'mainnet' : 'testnet']].WEB3_PROVIDER
        );

        this.metaMaskWeb3 = window['ethereum'];
        this.Web3Provider = new Web3(this.providers.infura);
    }


    getContract = (abi, address) => {
        return new this.Web3Provider.eth.Contract(abi, address);
    }

    getBalance = (address) => {
        return this.Web3Provider.eth.getBalance(address);
    }

    getBlock = () => {
        return this.Web3Provider.eth.getBlock('latest');
    }


    getAccounts = () => {
        return new Promise((resolve, reject) => {
            const onAuth = (address) => {

                this.Web3Provider.setProvider(this.providers.metamask);
                resolve({
                    address,
                    network: net,
                    errorCode: 0,
                    errorMsg: ''
                })
            };

            const onError = (errorParams) => {
                this.Web3Provider.setProvider(this.providers.infura);
                reject(errorParams)
            };
            const usedNetworkVersion = IS_PRODUCTION ? 1 : 3;
            const net = usedNetworkVersion === 1 ? 'mainnet' : 'ropsten';
            const isValidMetaMaskNetwork = () => {
                const networkVersion = Number((this.metaMaskWeb3.chainId).slice(-1));
                if (usedNetworkVersion !== networkVersion) {
                    onError({
                        errorCode: 2,
                        errorMsg: 'Please choose ' + net + ' network in Metamask.'
                    })
                    return false
                }
                return true;
            };


            if (this.metaMaskWeb3 && this.metaMaskWeb3.isMetaMask) {
                isValidMetaMaskNetwork()
                this.metaMaskWeb3.on('accountsChanged', (accounts) => {
                    if (isValidMetaMaskNetwork()) {
                        if (accounts.length) {
                            onAuth(accounts[0]);
                        } else {
                            onError({
                                errorCode: 3,
                                errorMsg: 'Not authorized'
                            });
                        }
                    }
                });
                this.metaMaskWeb3.on('chainChanged', () => {
                    window.location.reload();
                });

                if (!this.metaMaskWeb3.selectedAddress) {
                    this.metaMaskWeb3.enable().catch(() => {
                        onError({
                            errorCode: 3,
                            errorMsg: 'Not authorized'
                        });
                    });
                } else {
                    if (this.metaMaskWeb3.selectedAddress) {
                        onAuth(this.metaMaskWeb3.selectedAddress);
                    } else {
                        onError({
                            errorCode: 3,
                            errorMsg: 'Not authorized'
                        });
                    }
                }
            } else {
                onError({
                    errorCode: 1,
                    errorMsg: 'Metamask extension is not found. You can install it from <a href="https://metamask.io" target="_blank">metamask.io</a>'
                });
            }
        })
    }


    getContract(abi, address) {
        return this.Web3Provider.eth.Contract(abi, address);
    }


    encodeFunctionCall(abi, data) {
        return this.Web3Provider.eth.abi.encodeFunctionCall(abi, data);
    }

    getMethodInterface(methodName, abi) {
        return abi.filter((m) => {
            return m.name === methodName;
        })[0];
    }

    createTransaction(method) {
        const interfaceMethod = this.getMethodInterface(
            'getDistributionToken',
            ContractDetails.MESON.ABI,
        );
        console.log(interfaceMethod)
        const trxRequest = ['0x68E0C1dBF926cDa7A65ef2722e046746EB0f816f']

        debugger
        const activateSignature = this.encodeFunctionCall(
            interfaceMethod,
            trxRequest,
        );
        console.log(activateSignature)
    }


    sendTransaction(transactionConfig, provider) {
        if (provider) {
            this.Web3Provider.eth.setProvider(this.providers[provider]);
        }
        return new Promise((resolve, reject) => {
            this.Web3Provider.eth
                .sendTransaction(transactionConfig, (err, response) => {
                    if (!err) {
                        const trxSubscription = setInterval(() => {
                            this.Web3Provider.eth.getTransactionReceipt(
                                response,
                                (error, transaction) => {
                                    if (transaction) {
                                        if (transaction.status) {
                                            resolve(transaction);
                                        } else {
                                            reject(err);
                                        }
                                        clearInterval(trxSubscription);
                                    }
                                    if (error) {
                                        clearInterval(trxSubscription);
                                    }
                                },
                            );
                        }, 1000);
                    } else {
                        reject(err);
                    }
                })
                .then(
                    (result) => {
                        console.log(result);
                    },
                    (err) => {
                        console.log(err);
                    },
                )
                .finally(() => {
                    if (provider) {
                        this.Web3Provider.eth.setProvider(this.providers.infura);
                    }
                });
        });
    }

}

export default MetamaskService;