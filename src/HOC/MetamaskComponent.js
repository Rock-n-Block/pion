import React from 'react';
import Web3 from 'web3';
import { useDispatch, useSelector } from 'react-redux';
import { userActions, modalActions } from '../redux/actions';


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

const higherOrderMetamaskComponent = (WComponent) => {


    const HOC = () => {

        const dispatch = useDispatch()


        const errorCode = useSelector(({ user }) => {
            return user.errorCode
        })

        let metaMaskWeb3;
        let providers;
        let Web3Provider;


        React.useEffect(() => {
            providers = {};
            providers.metamask = Web3.givenProvider;
            providers.infura = new Web3.providers.HttpProvider(
                WEB3_CONSTANTS[networks[IS_PRODUCTION ? 'mainnet' : 'testnet']].WEB3_PROVIDER
            );

            metaMaskWeb3 = window['ethereum'];
            Web3Provider = new Web3(providers.infura);


            getAccounts()
        }, [])


        const getContract = (abi, address) => {
            return new Web3Provider.eth.Contract(abi, address);
        }

        const getBalance = (address) => {
            return Web3Provider.eth.getBalance(address);
        }

        const getBlock = () => {
            return Web3Provider.eth.getBlock('latest');
        }


        const getAccounts = () => {
            return new Promise((resolve, reject) => {
                const onAuth = (address) => {

                    Web3Provider.setProvider(providers.metamask);
                    resolve({
                        address,
                        network: net,
                        errorCode: 0,
                        errorMsg: ''
                    })
                    dispatch(userActions.setUserData({
                        address,
                        network: net,
                        errorCode: 0,
                        errorMsg: ''
                    }))
                    dispatch(modalActions.toggleModal(false))
                };

                const onError = (errorParams) => {
                    debugger
                    window['ethereum'].setProvider(providers.infura);
                    dispatch(userActions.setUserData(errorParams))
                    dispatch(modalActions.toggleModal(true))
                };

                const usedNetworkVersion = IS_PRODUCTION ? 1 : 4;
                const net = usedNetworkVersion === 1 ? 'mainnet' : 'rinkeby';
                const isValidMetaMaskNetwork = () => {
                    const networkVersion = Number((metaMaskWeb3.chainId).slice(-1));
                    if (usedNetworkVersion !== networkVersion) {
                        onError({
                            errorCode: 2,
                            errorMsg: 'Please choose ' + net + ' network in Metamask.'
                        })
                        return false
                    }
                    return true;
                };


                if (metaMaskWeb3 && metaMaskWeb3.isMetaMask) {

                    metaMaskWeb3.on('accountsChanged', (accounts) => {
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
                    metaMaskWeb3.on('chainChanged', () => {
                        if (isValidMetaMaskNetwork()) {
                            if (metaMaskWeb3.selectedAddress.length) {
                                onAuth(metaMaskWeb3.selectedAddress);
                            } else {
                                onError({
                                    errorCode: 3,
                                    errorMsg: 'Not authorized'
                                });
                            }
                        }
                    });

                    if (!metaMaskWeb3.selectedAddress) {
                        metaMaskWeb3.enable().catch(() => {
                            onError({
                                errorCode: 3,
                                errorMsg: 'Not authorized'
                            });
                        });
                    } else {
                        if (metaMaskWeb3.selectedAddress) {
                            onAuth(metaMaskWeb3.selectedAddress);
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
        return (
            <WComponent getAccounts={getAccounts}></WComponent>
        )
    }
    return HOC
}

export default higherOrderMetamaskComponent;