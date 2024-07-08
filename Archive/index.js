const mqtt = require("mqtt");
const fs = require("fs");
const mqtt_address = "mqtt://localhost:1883";
const database_filename = "database1";
const mqtt_client = mqtt.connect(mqtt_address);

mqtt_client.on("connect", function () {
    mqtt_client.subscribe("beaconid");
});
mqtt_client.on("message", function (topic, message) {
    fs.appendFileSync(database_filename, message.toString());
    // mqtt_client.end();
})