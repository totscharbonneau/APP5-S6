const mqtt = require("mqtt");
const fs = require("fs");
const mqtt_address;
const database_filename;
const mqtt_client = mqtt.connect(mqtt_address);

mqtt_client.on("connect", function () {
    mqtt_client.subscribe("beaconid");
});
mqtt_client.on("message", function (topic, message) {
    fs.appendFileSync(database_filename, message.toString());
    mqtt_client.end();
})