import Web3 from 'web3';


const IS_PRODUCTION = false;

const WEB3_CONSTANTS = {
    rinkeby: {
        WEB3_PROVIDER: 'https://rinkeby.infura.io/v3/e19163752e5143b4ba709e31a1a0decd'
    }
};


const networks = {
    production: 'mainnet',
    testnet: 'rinkeby'
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

            const usedNetworkVersion = IS_PRODUCTION ? 1 : 4;
            const net = usedNetworkVersion === 1 ? 'mainnet' : 'rinkeby';
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
}

export default MetamaskService;