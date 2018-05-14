const Web3 = require('web3');
const { web3Config:{ infuraUrl} } = require('../config');
const log = require('ololog').configure({ time: true });
const ansi = require('ansicolor').nice;

let web3Conn = new Web3(new Web3.providers.HttpProvider(infuraUrl));

let validator = {};


/**
	* Validate inputs received from getBalance API.
*/
validator.getBalance = (address) => {
	if(!address){
		log(`Address is null or undefined: ${address}`.red);
		return {status: false, message: "Please provide a wallet address"};
	}
	if(!web3Conn.utils.isAddress(address)) {
		log(`Invalid Ether address: ${address}`.red);
		return {status: false, message: "Please provide a valid ether wallet address"};	
	}
	return {status: true};
};


/**
	* Validate inputs received from sendTransaction API.
*/
validator.sendTransaction = (request) => {
	let {amount, destination, privateKey} = request;
	request = JSON.stringify(request);
	if(amount && destination && privateKey) {
		if(!web3Conn.utils.isAddress(destination)) {
			log(`Invalid Ether address: ${destination}`.red);
			return {status: false, message: "Please provide a valid ether wallet address"};	
		}
		return {status:true};
	} else {
		log(`Missing required fields ${request}`.red);
		return {
			status: false, 
			message: "Please provide all required values(amount, privateKey and destination)"
		};
	}
};


module.exports = validator;

