// import Node.js modules
var _ = require('underscore');
var fs = require('fs');
var dgram = require('dgram');
//import local modules
var conffile = fs.readFileSync("config.json");
var config = JSON.parse(conffile);
var mb = require('./modbus.js');

// using callbacks since node processes are asynchronous
// response is in pure json (application/json)
// additional callback can be implemented in sub-functions

//udp socket opened once
var uclient = dgram.createSocket('udp4');

//cli messages
async function cli() {
	console.log('Starting modbus_to_csv application...');
	await timer(1000);
	console.log('Modbus data registers will be sent in csv format to:');
	await(1000);
	console.log('    UDP server: '+config.host.ip);
	await(1000);
	console.log('    On port:    '+config.host.port);
	await timer(1000);
	console.log('Press Ctrl+C to exit the application...');
}

//timer function using Promise
function timer(ms) {
	return new Promise(res => setTimeout(res, ms));
}


async function mbquery() {
	//check size of modbus queries
	//console.log('size of mapping: '+_.size(config.mapping));
	let arr = [];
	for(let item of config.mapping) {
		//console.log(item);
		let resp = await mb.mbclient(item);
		arr.push(resp);
		//console.log('in mbquery: '+resp);
	}
	return arr;
}

async function load() {
	while(true) {
		mbquery()
		.then(val => {
		//console.log('after mbquery call: '+val);
		var message = val.toString()+'\n';
		//udp socket opened previously
		//var uclient = dgram.createSocket('udp4');
		uclient.send(message, 0, message.length, Number(config.host.port), config.host.ip, function(err, bytes) {
			if (err) console.log(err);
			//must not close the socket (keep alive connection)
			//uclient.close();
			});
		});
		await timer(Number(config.host.timeout));
	}
}

cli();
load();

