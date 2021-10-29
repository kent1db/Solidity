const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');               // Web3 with maj is for constructor
const web3 = new Web3(ganache.provider());  //with lowercase, its an instance, and Web3 argument is the network we attempt to connect to, here local test with ganache

const {abi, evm} = require('../compile.js');

let accounts;
let inbox;

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();
    // Use one of those account to deploy the contract
    inbox = await new web3.eth.Contract(abi)                    // tells web3 there is a contract and what method Inbox has
        .deploy({data: evm, arguments: ['Hi there!'],}) // tells web3 that we want to deploy a new contract, "arguments" of the contract, Bytecode as Data and 'Hi there' as initialMessage of Inbox contract
        .send({ from: accounts[0], gas: '1000000' });   // instructs web3 to send out a transaction that create this contract, Account we will use and gas
});

describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address);                        // check if there is an adress, if true then the contract as been deployed
    });
    it('has a default message', async () => {
        const message = await inbox.methods.getMessage().call(); // call to the getMessage function
        // const message = await inbox.methods.message().call();   //message will contain the default message
        assert.strictEqual(message, 'Hi there!');      //comparison between message and the message we put
    });
    it('can change the message', async () => {
        await inbox.methods.setMessage('bye').send({ from: accounts[0] });  // we use setMessage method to change the message
        const message = await inbox.methods.message().call();               // we check if it works
        assert.strictEqual(message, 'bye');
    });
});
