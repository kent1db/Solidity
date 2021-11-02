const assert = require('assert'); // requiring the assert librairie for node
const ganache = require('ganache-cli'); //local test network, by doing this it automaticlly boot local test network
const Web3 = require('web3');               // Web3 with maj is for constructor
const web3 = new Web3(ganache.provider());  //with lowercase, its an instance, and Web3 argument is the network we attempt to connect to, here local test with ganache

const {abi, evm} = require('../compile.js');

let accounts;
let lottery;

beforeEach(async () => {
	// Get a list of all accounts
	accounts = await web3.eth.getAccounts();
	// Use one of those account to deploy the contract
	lottery = await new web3.eth.Contract(abi)                    // tells web3 there is a contract and what method Inbox has
		.deploy({data: evm}) // tells web3 that we want to deploy a new contract, "arguments" of the contract, Bytecode as Data and 'Hi there' as initialMessage of Inbox contract
		.send({ from: accounts[0], gas: '1000000' });   // instructs web3 to send out a transaction that create this contract, Account we will use and gas
});

describe('Lottery contract', () => {
	it('deploys a contract', () => {
		assert.ok(lottery.options.address);
	});

	it('allows one account to enter', async () => {
		await lottery.methods.enter().send({from: accounts[0], value: web3.utils.toWei('0.02', "ether")});

		const players = await lottery.methods.getPlayers().call({from: accounts[0]});
		assert.strictEqual(accounts[0], players[0]);
		assert.strictEqual(1, players.length);
	});

	it('allows multiple accounts to enter', async () => {
		await lottery.methods.enter().send({from: accounts[0], value: web3.utils.toWei('0.02', "ether")});
		await lottery.methods.enter().send({from: accounts[1], value: web3.utils.toWei('0.02', "ether")});
		await lottery.methods.enter().send({from: accounts[2], value: web3.utils.toWei('0.02', "ether")});

		const players = await lottery.methods.getPlayers().call({from: accounts[0]});
		assert.strictEqual(accounts[0], players[0]);
		assert.strictEqual(accounts[1], players[1]);
		assert.strictEqual(accounts[2], players[2]);
		assert.strictEqual(3, players.length);
	});

	it('require a minimum amount of ether to enter', async () => {
		try{
			await lottery.methods.enter().send({from: accounts[0], value: web3.utils.toWei('0.01', "ether")});
			assert(false); //if, the line before, doesn't throw error, this will
		}
		catch (err) {
			assert(err); //make sure there is an error
		}
	});

	it('only manager can pick a winner', async () => {
		try{
			await lottery.methods.pickWinner().send({from: accounts[1]});
			assert(false);
		}
		catch (err) {
			assert(err);
		}
	});

	it("send money to the winner and reset the player array", async () => {
		await lottery.methods.enter().send({from: accounts[0], value: web3.utils.toWei('2', "ether")});
		const initialBalance = await web3.eth.getBalance(accounts[0]);
		await lottery.methods.pickWinner().send({from: accounts[0]});
		const finalBalance = await web3.eth.getBalance(accounts[0]);
		const difference = finalBalance - initialBalance;
		assert(difference > web3.utils.toWei('1.8', "ether"));

	});
});
