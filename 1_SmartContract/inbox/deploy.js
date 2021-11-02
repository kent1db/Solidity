const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const {abi, evm} = require('./compile');

const provider = new HDWalletProvider(
	'possible piano manage lens chat uncle federal prevent insect nut giant travel',//first arg is account mnemonic
	'https://rinkeby.infura.io/v3/cfa140a5b20a4d08b1b63d403e302db8' //Infura link to Rinkeby
);

const web3 = new Web3(provider); //Instance to interact with

const deploy = async () => {
	const accounts = await web3.eth.getAccounts();

	console.log('Attempting to deploy from account', accounts[0]);

	const result = await new web3.eth.Contract(abi)
		.deploy({data: evm, arguments: ['Hello World!']})
		.send({gas: '1000000', from: accounts[0]});

	console.log('Contract deployed to', result.options.address);

	provider.engine.stop() // to prevent a hanging deployment
};

deploy();