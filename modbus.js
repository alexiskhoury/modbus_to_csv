// modbus.js
var modbus = require('jsmodbus');
//var _ = require('underscore');

var self = {

  mbclient: function(params){
	  return new Promise((resolve, reject) => {
		//code here
		var client = modbus.client.tcp.complete({
			'host': params.ip,
			'port': params.port,
			'autoReconnect': false, //client will disconnect on error
			'reconnectTimeout': 1000,
			'timeout': 5000,
			'unitId': 0,
			'logEnabled': true
		});
		//client on connect function (function 03 assumed else insert a switch)
		client.on('connect', function () {
			client.readHoldingRegisters(Number(params.register), Number(params.no))
			.then(function (resp) {
				//console.log('in modbus: '+resp.register);
				client.close();
				resolve(resp.register);
			}).catch(function () {
				console.error(require('util').inspect(arguments, {
					depth: null
				}));
				client.close();
			})
		});
		// console.error replaced by function: client.on 2nd argument must be a function
		//client.on('error', function() {_.extend(res, {"err": "modbus query error"})});
		client.connect();
	});
  }
}

module.exports = self;
