/*
   Based on Neil Kolban example for IDF: https://github.com/nkolban/esp32-snippets/blob/master/cpp_utils/tests/BLE%20Tests/SampleScan.cpp
   Ported to Arduino ESP32 by Evandro Copercini
   Changed to a beacon scanner to report iBeacon, EddystoneURL and EddystoneTLM beacons by beegee-tokyo
   Upgraded Eddystone part by Tomas Pilny on Feb 20, 2023
*/

#include <Arduino.h>

#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>
#include <BLEEddystoneURL.h>
#include <BLEEddystoneTLM.h>
#include <BLEBeacon.h>
#include <WiFi.h>
#include <ArduinoWebsockets.h>

// #include <AsyncTCP.h>
// #include <ESPAsyncWebServer.h>



const char *ssid = "Pixeltots";
const char *password= "dlapoudreendroit";

const char* websockets_server = "ws://192.168.66.102:8001"; //server adress and port

using namespace websockets;



int scanTime = 2;  //In seconds
BLEScan *pBLEScan;

void onMessageCallback(WebsocketsMessage message) {
    Serial.print("Got Message: ");
    Serial.println(message.data());
    if(message.data().equals("true")){
      digitalWrite(18, HIGH);
    }
    else if(message.data().equals("false")){
      digitalWrite(18, LOW);
    }
}


class MyAdvertisedDeviceCallbacks : public BLEAdvertisedDeviceCallbacks {

  void onResult(BLEAdvertisedDevice advertisedDevice) {

    if (advertisedDevice.haveManufacturerData() == true) {
      String strManufacturerData = advertisedDevice.getManufacturerData();

      uint8_t cManufacturerData[100];
      memcpy(cManufacturerData, strManufacturerData.c_str(), strManufacturerData.length());

      if (strManufacturerData.length() == 25 && cManufacturerData[0] == 0x4C && cManufacturerData[1] == 0x00) {
        Serial.println("Found an iBeacon!");
        BLEBeacon oBeacon = BLEBeacon();
        oBeacon.setData(strManufacturerData);
        Serial.printf("iBeacon Frame\n");
        Serial.printf(
          "ID: %04X Major: %d Minor: %d UUID: %s Power: %d\n", oBeacon.getManufacturerId(), ENDIAN_CHANGE_U16(oBeacon.getMajor()),
          ENDIAN_CHANGE_U16(oBeacon.getMinor()), oBeacon.getProximityUUID().toString().c_str(), oBeacon.getSignalPower()
        );
      } 
    }
  }
};
WebsocketsClient client;
void setup() {
  Serial.begin(115200);
  Serial.println("Scanning...");
  pinMode(18, OUTPUT);
  wifiConnect();

  client.onMessage(onMessageCallback);
  client.connect(websockets_server);
  client.send("Hi Server!");
  client.ping();

  BLEDevice::init("");
  pBLEScan = BLEDevice::getScan();  //create new scan
  pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks());
  pBLEScan->setActiveScan(true);  //active scan uses more power, but get results faster
  pBLEScan->setInterval(100);
  pBLEScan->setWindow(99);  // less or equal setInterval value
}

void loop() {

  // 
  BLEScanResults *foundDevices = pBLEScan->start(scanTime, false);
  // Serial.print("Devices found: ");
  // Serial.println(foundDevices->getCount());
  // Serial.println("Scan done!");
  pBLEScan->clearResults();  // delete results fromBLEScan buffer to release memory

  // delay(2000);
  // digitalWrite(18, LOW);
  // delay(2000);
  client.poll();
}

void wifiConnect(){
    WiFi.begin(ssid, password);
    Serial.println("\nConnecting");

    for(int i = 0; i < 10 && WiFi.status() != WL_CONNECTED; i++) {
        Serial.print(".");
        delay(1000);
    }

    Serial.println("\nConnected to the WiFi network");
    Serial.print("Local ESP32 IP: ");
    Serial.println(WiFi.localIP());
}