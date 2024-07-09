const mqtt = require("mqtt");
const fs = require("fs");
const express = require("express");
const cors = require('cors')
const mqtt_address = "mqtt://localhost:1883";
const database_filename = "database.csv";
const mqtt_client = mqtt.connect(mqtt_address);
const http_port = 8003;

mqtt_client.on("connect", function () {
    mqtt_client.subscribe("beaconid");
});
mqtt_client.on("message", function (topic, message) {
    var date = new Date();
    var line = '"'.concat(date.getTime().toString(), '","', message.toString(), '"\n')
    fs.appendFileSync(database_filename, line);
})

var archive = express()
archive.use(cors());
archive.get("/", function(request, response){
    response.send(fs.readFileSync(database_filename, "utf8"));
});
archive.listen(http_port, function () {
    console.log("Started application on port %d", http_port);
});