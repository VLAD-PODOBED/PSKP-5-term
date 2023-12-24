const rpcWSC = require('rpc-websockets').Server;

let server = new rpcWSC({port: 4000, host: 'localhost'});

server.register('A', params => { console.log('A уведомленно'); }).public();
server.register('B', params => { console.log('B уведомленно'); }).public();
server.register('C', params => { console.log('C уведомленно'); }).public();