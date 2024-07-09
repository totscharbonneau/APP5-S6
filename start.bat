start /b mosquitto -v
start /b node Relai/index.js
start /b node Archive/index.js
start /b node Control/index.js
cd webui
start /b ng serve