const routes = require('express').Router();
const {createWallet, getBalance, sendEther} = require('../helper/web3-helper');

routes.get('/createWallet', (req, res) => {
	const response = createWallet();
	res.json(response);
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
	sendEther(req.body);
	res.json({body:"success"});
});

module.exports = routes
