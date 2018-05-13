require('dotenv').config()

const config = {
	port : process.env.PORT,
	web3Config: {
		senderAddress: process.env.WALLET_ADDRESS,
		senderPrivateKey: process.env.WALLET_PRIVATE_KEY,
		receieverAddress: process.env.DESTINATION_WALLET_ADDRESS,
		infuraUrl: `https://rinkeby.infura.io/${process.env.INFURA_ACCESS_TOKEN}`
	}
};

module.exports = config;