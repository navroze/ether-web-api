const Web3 = require('web3');
const validator = require('./validation-helper');
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
	log(`Private key before encryption ${privateKey}`.yellow);
	let {crypto:{mac}} = web3Conn.eth.accounts.encrypt(privateKey, 'test!');
	log(`Wallet ${address} created with encrypted privat -key=${mac}`.green);
	return {address, privateKey: mac};
};


/**
	* Get the balance using web3 getBalance method,
	* Conver wei to ether using utils provided by web3.
*/
web3.getBalance = async (address, callback) => {
	try{
		const {status, message} = validator.getBalance(address);
		if(!status) return {message};
		let balance = await web3Conn.eth.getBalance(address);
		balance = web3Conn.utils.fromWei(balance, 'ether');
		log(`Your wallet balance is=${balance} ETH for address=${address}`.green);
		return {address, balance};
	} catch(error) {
		log(`Found error in getBalance ${error}`.red);
		return {message:"Something went wrong"};
	}
};


/**
	* Send ethereum from source to destination
	* Use web3 1.0 to sign a transaction and then send it using signedtransaction method.
*/
web3.sendTransaction = async ({amount, destination, privateKey}) => {
	try {
		const {status, message} = validator.sendTransaction({amount, destination, privateKey});
		if(!status)  return {message};
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
		log(`Found error in sendTransaction ${error}`.red);
		return {message:"Something went wrong"};
	}
};

module.exports = web3;