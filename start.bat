start /b mosquitto -v > out_mosquitto.txt
start /b node Relai/index.js > out_relai.txt
start /b node Archive/index.js > out_archive.txt
start /b node Control/index.js > out_control.txt
cd webui
start /b ng serve > out_webui.txt