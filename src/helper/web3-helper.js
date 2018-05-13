const Web3 = require('web3');
const { web3Config:{ infuraUrl, senderAddress } } = require('../config');
const { getCurrentGasPrices } = require('../lib/util');
const log = require('ololog').configure({ time: true });
const ansi = require('ansicolor').nice;

let web3Conn = new Web3(new Web3.providers.HttpProvider(infuraUrl));

let web3 = {};


/**
	* Use web3s inbuilt methods to generate a address and privat-key,
	* Encrypt the private key and send it to the user.
*/
web3.createWallet = () => {
	const { address, privateKey } = web3Conn.eth.accounts.create();
	let {crypto:{mac}} = web3Conn.eth.accounts.encrypt(privateKey, 'test!');
	return {address, privateKey: mac};
};


/**
	* Get the balance using web3 getBalance method,
	* Conver wei to ether using utils provided by web3.
*/
web3.getBalance = async (address, callback) => {
	try{
		let balance = await web3Conn.eth.getBalance(address);
		balance = web3Conn.utils.fromWei(balance, 'ether');
		return {address, balance};
	} catch(error) {
		throw error;
	}
};


/**
	* Send ethereum from source to destination
	* Use web3 1.0 to sign a transaction and then send it using signedtransaction method.
*/
web3.sendEther = async ({amount, destination, privateKey}) => {
	try {
		web3Conn.eth.defaultAccount = senderAddress;
		let myBalanceWei = await web3Conn.eth.getBalance(web3Conn.eth.defaultAccount);
		let myBalance = web3Conn.utils.fromWei(myBalanceWei, 'ether');

		log(`Your wallet balance is currently ${myBalance} ETH`.green);
  		let nonce = await web3Conn.eth.getTransactionCount(web3Conn.eth.defaultAccount);
  		log(`The outgoing transaction count for your wallet address is: ${nonce}`.magenta);

  		/**
  		 * Fetch the current transaction gas prices from https://ethgasstation.info/
  		 */
  		let gasPrices = await getCurrentGasPrices();

  		let wei = web3Conn.utils.toWei(amount, 'ether');
  		wei = parseInt(wei, 10);


  		//Create a transaction object to sign.
  		const {rawTransaction} = await web3Conn.eth.accounts.signTransaction({
  		    to: destination,
  		    value: wei,
  		    gas: 21000,
  		    gasPrice: gasPrices.low * 1000000000,
  		    nonce: nonce,
  		    chainId: 4
  		}, privateKey);


  		//Send the signed transaction
  		let transactionDetails = await web3Conn.eth.sendSignedTransaction(rawTransaction);

	} catch (error) {
		console.log("Error", error);
	}
};

module.exports = web3;