const server = require('./server');

let app = {};

app.init = () => {
	//Start the server
	server.init();
};

app.init();

module.exports = app;