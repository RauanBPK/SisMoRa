# SisMoRa <img src="/APP/mobile/SisMoRA-app/assets/icon.png" width="50">

Sistema de Monitoramento do Rio Araranguá - TCC Version

(Araranguá's River Monitoring System)

## About
This project's goal was to create a platform to monitor the Araranguá's river water indicators, such as pH and TDS(Total Dissolved Solids).

As a baseline, the water was classified as Good, Warning or Bad based on Rice farming indicators. Threshold values should be ajusted to whatever crop is of interest.
## Overview:

The project can be divided into 3 major parts:
- A sensor network built using Arduinos Uno/MEGA, nRF24L01+ modules, and a SIM900 GSM Shield, besides pH and TDS specific sensors
- A Serverless app built with Firebase Cloud Functions and Firestore NoSQL storage
- A React Native/Expo Android App

<img src="/imgs/visao_geral.png" width="640">

## Mobile APP Screens
1.  **Initial screen** - Show sensors geolocation, date and time of the network's last read, and classifies the water into 3 classes, Good, Warning or Bad.
2.  **History** - Allows the user to check older readings
3.  **Graphs** - Show graphs for a range of readings. Plots pH and TDS.

<p float="left">
<img src="/imgs/inicial.jpeg" width="250">
<img src="/imgs/historico.jpeg" width="250">
<img src="/imgs/graficos.jpeg" width="250">
</p>

## Room for improvement _OR_ How I realized that _"the buraco was mais embaixo"_
Limited by the (few) available hardware at the lab, and therefore limited by the technologies that could be used, some (sometimes important) details were not
implemented in this version. 

Things like SSL/TLS and authentication regarding the connection between the GSM Module and the Cloud, and the Cloud and the mobile App are important and would
probably be necessary for this project to be considered production ready.

Or yet, why not use MQTT? Or more modern and capable hardware like a esp32? (nRF24 are cheap and deliver a pretty good range, but are not that reliable). LoRa?
SigFox? Maybe solar is a good idea to keep the nodes running? What about remote troubleshotting? Rain? Sensor callibration?

...

Well..
As this project was my TCC (Final graduation project) I had to limit the project's scope. I made this working version, almost as a PoC, so that me or others
soon-to-be-computer-engineers could keep improving on it and eventually have a fully working and reliable platform to assist (primarily) farmers that
use the river's water for irrigation.

## More info

If this project caught your attention, you can read more [here](TCC_RauanPires.pdf). (portuguese)
