# Supporting Bike Missions : Visualising air quality information in situ : Client Stationary

The Client Stationary corresponds to the application running on the university server. <br> This repository contains all resources needed to use the webserver as well as instructions on which services need to be started before it can be used. 

## Project setup
* Cloning the Github project with  `git clone https://github.com/mmigge/VAQIIS.git` <br>
**_Warning:_** We recommend to clone the project into the "home" folder of your current user,  so that paths in this tutorial match yours (Full-Path: /home/)

* Install MongoDB by following the official guide: [MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

* Install the MQTT-Broker with `sudo apt install mosquitto`


## How to run the webserver and database

* Connect to the university server (giv-project2) and login (you have to be inside the university network). <br> Continue by running `sudo service mongod start`
    
* Navigate into the VAQIIS/api folder and start the webserver with `npm start`

## Automations via crontab
Before all implemented functionalities are available to the user after a successful boot procedure, 2 different commands must be executed: 
* `sudo service mongod start`
* `cd VAQIIS/api` followed `npm start`

You can automate the execution of these scripts with a crontab job. <br> To create a crontab job for the local user (! not sudo or root!) just type `crontab -e` and add the followling lines <br>
`@reboot sleep 30 && sudo service mongod start &` <br>
`@reboot sleep 45 && cd /home/pi/VAQIIS/api/ && npm start &`<br>

## Troubleshooting
It can happen that messages sent to the MQTT server are not accepted by the service. This is a problem of using websockets under Ubuntu, which are (unfortunately) necessary. This problem can be solved by simply restarting the server.

