# Supporting Bike Missions : Visualising air quality information in situ : Client Mobile

The Client Stationary corresponds to the application running on the sensorbike. <br> This repository contains all resources needed to use the webserver as well as instructions how they have to be deployed. 

## Clone and creating a production build 
* Clone the Github project with  `git clone https://github.com/mmigge/VAQIIS.git` <br>

* Navigate into the `VAQIIS/client_mobile/` folder and run `npm run build`

## Using the production build

After a successful build, the entire build folder must be moved to the Templates folder of the [VAQIIS Webserver](https://github.com/Thiemann96/VAQIIS_WebServer). These resources are later used by the Flask server running on Raspberry Pi to display data to users.
