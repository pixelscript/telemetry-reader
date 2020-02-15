#A CRSF telemetry reader (not finished)

The aim of this project was to enable the reading of telemetry via a bluetooth mod on a taranis and have it control an antenna tracker.

I managed to get the CRSF telemetry broadcasting over bluetooth via a custom branch of the taranis firmware. This app can decode the serial and display it in the browser in real time. HOWEVER I had problems with the song and dance required to keep the bluetooth connection stable and eventually moved onto other things. I'm putting up the code here in case anyone else finds it of use.

You need to start the node service first that is going to listen to the serial

    npm i
    npm run start

Then you need to start the server for the front end application

    cd telemetry-viewer
    npm i
    npm run start