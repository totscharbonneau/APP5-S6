const websock = require("ws");
const mqtt = require("mqtt");
const ws_port = 8002;
const mqtt_address= "mqtt://localhost:1883";

const mqtt_client = mqtt.connect(mqtt_address);

mqtt_client.on("connect", () => {
    mqtt_client.subscribe("beaconid", (err) => {
      if (!err) {
        mqtt_client.publish("beaconid", "Hello mqtt");
      }
    });
  });

const websockserver = new websock.Server({ port: ws_port });
websockserver.on('connection', function (ws) {
    ws.on('error', console.error);
    ws.on('message', function (data) {
        console.log('received: %s', data);
        mqtt_client.publish("beaconid", data);
    });
});