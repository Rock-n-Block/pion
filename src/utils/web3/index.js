import Web3 from 'web3';
import ContractDetails from './contract-details';
import tokensDecimal from './decimals';
import BigNumber from "bignumber.js"


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

    checkAllowance = (walletAddress, tokenAddress, amount, contract) => {
        return new Promise((resolve, reject) => {
            contract.methods
                .allowance(walletAddress, tokenAddress)
                .call()
                .then(
                    (result) => {
                        result = result ? result.toString(10) : result;
                        result = result === '0' ? null : result;
                        if (result && new BigNumber(result).minus(amount).isPositive()) {
                            resolve(true);
                        } else {
                            reject(false);
                        }
                    },
                    () => {
                        reject(false);
                    }
                );
        });
    }

    getContributeTransaction(amount, tokenAddress, walletAddress, method) {

        const stringAmountValue = new BigNumber(amount)
            .times(Math.pow(10, tokensDecimal.PION))
            .toString(10);

        const depositMethod = this.getMethodInterface(
            method,
            ContractDetails.PRIZE.ABI
        );

        const depositSignature = this.encodeFunctionCall(
            depositMethod,
            [stringAmountValue]
        );

        const contributeTransaction = () => {
            return this.sendTransaction(
                {
                    from: walletAddress,
                    to: tokenAddress,
                    data: depositSignature,
                },
                'metamask'
            );
        };

        return {
            action: contributeTransaction,
            signature: depositSignature,
            token: tokenAddress,
        };
    }


    createTokenTransaction = (amount, tokenAddress, walletAddress, method) => {
        const contributeData = this.getContributeTransaction(amount, tokenAddress, walletAddress, method);
        const transaction = {
            title:
                'Make the transfer of 10 pion tokens to contract',
            to: tokenAddress,
            data: contributeData.signature,
            action: contributeData.action,
            ethValue: amount,
        };

        this.createTransactionObj(transaction, walletAddress)
    }

    approveToken = (walletAddress, tokenAddress, callback) => {
        const approveMethod = this.getMethodInterface('approve', ContractDetails.PION.ABI);

        const approveSignature = this.encodeFunctionCall(
            approveMethod,
            [
                tokenAddress,
                new BigNumber(90071992.5474099)
                    .times(Math.pow(10, Math.max(tokensDecimal.PION, 7)))
                    .toString(10),
            ]
        );


        const approveTransaction = () => {
            return this.sendTransaction(
                {
                    from: walletAddress,
                    to: ContractDetails.PION.ADDRESS,
                    data: approveSignature,
                },
                'metamask'
            );
        };

        const transaction = {
            title:
                'Authorise the contract for getting prize tokens',
            to: ContractDetails.PION.ADDRESS,
            data: approveSignature,
            action: approveTransaction,
            onCoplete: callback
        };

        this.createTransactionObj(transaction, walletAddress)
    }


    getContract(abi, address) {
        return new this.Web3Provider.eth.Contract(abi, address);
    }


    encodeFunctionCall(abi, data) {
        return this.Web3Provider.eth.abi.encodeFunctionCall(abi, data);
    }

    getMethodInterface(methodName, abi) {
        return abi.filter((m) => {
            return m.name === methodName;
        })[0];
    }

    createTransactionObj(transaction, walletAddress) {
        this.prepareTransaction(
            {
                type: 'metamask',
                address: walletAddress,
            },
            transaction
        );
    }

    createTransaction(method) {
        const interfaceMethod = this.getMethodInterface(
            'getDistributionToken',
            ContractDetails.MESON.ABI,
        );
        console.log(interfaceMethod)
        const trxRequest = ['0x68E0C1dBF926cDa7A65ef2722e046746EB0f816f']

        const activateSignature = this.encodeFunctionCall(
            interfaceMethod,
            trxRequest,
        );
        console.log(activateSignature)
    }


    prepareTransaction(wallet, transaction) {

        transaction
            .action(wallet)
            .then((result) => {
                if (transaction.onCoplete) {
                    transaction.onCoplete(true)
                }
            })
            .catch(err => {
                if (transaction.onCoplete) {
                    transaction.onCoplete(false)
                }
            })
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