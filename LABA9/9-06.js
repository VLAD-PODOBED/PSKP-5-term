const rpcWSC = require('rpc-websockets').Server;

let server = new rpcWSC({ port: 4000, host: 'localhost' });

server.event('A');
server.event('B');
server.event('C');

process.stdin.setEncoding('utf8');

// Обработчик ошибок
server.on('error', (err) => {
    console.error('Server error:', err);
});

// Обработчик закрытия соединения
server.on('close', () => {
    console.log('Server closing');
});

process.stdin.on('readable', () => {
    let data = null;
    while ((data = process.stdin.read()) !== null) {
        switch (data.trim().toUpperCase()) {
            case 'A':
                server.emit('A', 'event A emitted');
                break;
            case 'B':
                server.emit('B', 'event B emitted');
                break;
            case 'C':
                server.emit('C', 'event C emitted');
                break;
            default:
                console.error('Wrong event type');
        }
    }
});
