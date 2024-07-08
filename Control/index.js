const express = require("express");
const websock = require("ws");
const cors = require('cors')
const ws_port = 8001;
const http_port = 8000;
var state = true;
const websockserver = new websock.Server({ port: ws_port });

websockserver.on('connection', function (ws) {
    ws.on('error', console.error);
    ws.on('message', function (data) {
        console.log('received: %s', data);
    });
});

var control = express()
control.use(cors());
control.get("/", function(request, response){
    websockserver.clients.forEach(function(client) {
        client.send(state.toString());
    });
    response.send(state.toString());
    state = !state;
});
control.listen(http_port, function () {
    console.log("Started application on port %d", http_port);
});