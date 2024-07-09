mosquitto -v &
node Relai/index.js &
node Archive/index.js &
node Control/index.js &
cd webui
ng serve &
wait