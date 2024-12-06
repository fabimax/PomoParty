var GameServer = require('./GameServer');

function startOgar3Room(port) {
    var gameServer = new GameServer();
    gameServer.config.serverPort = port;
    gameServer.start();
}

exports.startOgar3Room = startOgar3Room;
