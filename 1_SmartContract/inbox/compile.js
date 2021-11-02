const path = require('path'); // for crossplatform
const fs = require('fs'); //file system
const solc = require('solc');

const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol'); // dirname constant read by node, the current directory
const source = fs.readFileSync(inboxPath, 'utf8');// utf8 encoding

const input = {
    language: 'Solidity',
    sources: {
        'Inbox.sol' : {
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

let InboxExport = {
    abi: output.contracts["Inbox.sol"].Inbox.abi,
    evm: output.contracts["Inbox.sol"].Inbox.evm.bytecode.object
};

module.exports = InboxExport;