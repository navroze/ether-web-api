const axios = require('axios');
const log = require('ololog').configure({ time: true });
const ansi = require('ansicolor').nice;

let util = {};

util.getCurrentGasPrices = async () =>{
	try{
		let response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
		
		let prices = {
		  low: response.data.safeLow / 10,
		  medium: response.data.average / 10,
		  high: response.data.fast / 10
		};

		console.log("\r\n");
		log (`Current ETH Gas Prices (in GWEI):`.cyan);
		console.log("\r\n");
		log(`Low: ${prices.low} (transaction completes in < 30 minutes)`.green);
		log(`Standard: ${prices.medium} (transaction completes in < 5 minutes)`.yellow);
		log(`Fast: ${prices.high} (transaction completes in < 2 minutes)`.blue);
		console.log("\r\n");
		return prices;

	} catch(error) {
		throw error;
	}
};

module.exports = util;