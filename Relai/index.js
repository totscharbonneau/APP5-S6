const websock = require("ws");
const mqtt = require("mqtt");
const ws_port = 8002;
const mqtt_address;

const mqtt_client = mqtt.connect(mqtt_address);

const websockserver = new websock.Server({ port: ws_port });
websockserver.on('connection', function (ws) {
    ws.on('error', console.error);
    ws.on('message', function (data) {
        console.log('received: %s', data);
        mqtt_client.publish("beaconid", data);
    });
});