# ECE-513-Final-Project


## Group Members
- Quentin Johnson
- Alan Manuel Loreto Cornídez
- Megan Mickey


## Usage
You can start this website on a server or on localhost. 
 1. Download this repository and save it wherever you like (whether you're a server or localhost)
 2. In your terminal, go the folder ECE-513-Final-Project in the place where you downloaded the repository. cd into the build folder.
 3. Type npm install to download any dependencies not alreading installed on your device.
 4. To start the website, run the following: `npm run devstart`
 5. Go to either localhost/3000 or your server url/3000 to view website.

This system uses a Particle Argon device integrated with a Heart Rate Sensor to collect and send data to the cloud. If you want to setup a device system hardware that will connect to our server, follow the instructions below:
 1. Once acquiring a Particle Argon and Heart Rate Sensor (MAX30102 Pulse Detection Blood Oxygen), connect them along with an rgb led using the following wiring: 
 ![image](https://user-images.githubusercontent.com/67599197/206813451-cc1464a4-3d90-497f-ac1d-76595882dc64.png)
 2. In addition, connect the wifi antenna to the Argon. To connect it to the internet, you will have to download the Particle app, register your device, and connecti it to wifi throught there.
 3. Then plug your device in to your computer using a micro usb cable capable of sending data. After installing the particle workbench extention in VSCode, create a new project with whatever name you'd like. In the main .ino file, copy the code in our simple_hr.ino file into it. Also, be sure to copy the files heartRate.h, heartRate.cpp, MAX30105.h, MAX30105.cpp, spo2_algorithm.h nad spo2_algorithm.cpp into your project in the src folder.
 4. Put your device into dfu mode by holding the mode button and tapping the reset button and the waiting until the onboard led starts blinking yellow before releasing the mode button. Then flash the code to your device by clicking the lightning bolt-looking button in the top right corner of VSCode. Now the code should be on your device.
 5. Next, to connect it to your desired server go the the particle console website and make an acount if you haven't already. In the integrations, tab, create 2 new webhooks. The first should have these parameters:
    - event name: timeReq
    - URL: your_url/devices/timeRec
    - Request type: POST
    - Request format: JSON

Then save the webhook
The next should have these parameters:
    - event name: healthData
    - URL: your_url/devices/healthData
    - Request type: POST
    - Request format: JSON
    - Go to Custom JSON data an paste this:
    {
  "event": "{{{PARTICLE_EVENT_NAME}}}",
  "json": {
    "hr": "{{{heart_rate}}}",
    "spo2": "{{{spo2}}}",
    "rdtm": "{{{read_time}}}"
  },
  "coreid": "{{{PARTICLE_DEVICE_ID}}}",
  "published_at": "{{{PARTICLE_PUBLISHED_AT}}}"
}


## Links
This is the link to our AWS server: http://ec2-18-237-50-20.us-west-2.compute.amazonaws.com:3000/

This is the link to our demo video: 

## Login Credentials
Here are some login credentials for a previously created patient and physician if you use our aws server:
Patient
 - email: 
 - password:
Physician
 - email:
 - password:
