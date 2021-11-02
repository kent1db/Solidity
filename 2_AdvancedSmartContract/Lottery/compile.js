const path = require('path'); // for crossplatform
const fs = require('fs'); //file system
const solc = require('solc');

const lotteryPath = path.resolve(__dirname, 'contracts', 'Scontract.sol'); // dirname constant read by node, the current directory
const source = fs.readFileSync(lotteryPath, 'utf8');// utf8 encoding

const input = {
	language: 'Solidity',
	sources: {
		'Scontract.sol' : {
			content: source,
		},
	},
	settings: {
		outputSelection: {
			'*': {
				'*': ['*'],
			},
		},
	},
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

let ScontractExport = {
	abi: output.contracts["Scontract.sol"].Lottery.abi,
	evm: output.contracts["Scontract.sol"].Lottery.evm.bytecode.object
};

module.exports = ScontractExport;