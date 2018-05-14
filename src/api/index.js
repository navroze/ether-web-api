const routes = require('express').Router();
const {createWallet, getBalance, sendTransaction} = require('../helper/web3-helper');

routes.get('/createWallet', (req, res) => {
	try {
		const response = createWallet();
		res.json(response);
	} catch(error) {
		res.json(error);
	}
});

routes.get('/getBalance', async ({query:{address}}, res) => {
	try {
		const balance = await getBalance(address);
		res.json(balance);
	} catch(error) {
		res.json(error);
	}
});

routes.post('/sendTransaction', async (req, res) => {
	try {
		const response = await sendTransaction(req.body);
		res.json(response);
	} catch(error) {
		res.json(error);
	}
});

module.exports = routes
