#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"
#include "spo2_algorithm.h"
#include <stdlib.h>
#include <stdio.h>
#include <time.h>
#include <iostream>
#include <string>

unsigned int state = 1;
MAX30105 particleSensor;


//Pins the sensor is connected to on the particle argon
int redPin = D7;
int greenPin = D6;
int bluePin = D5;

//To control light on sensor
byte pulseLED = 11; //Must be on PWM pin
byte readLED = 13; //Blinks with each data read

//To store data from sensor
uint32_t irBuffer[100]; //infrared LED sensor data
uint32_t redBuffer[100];  //red LED sensor data

//Stores calculated blood oxygen and heart rate
int32_t bufferLength; //data length
int32_t spo2; //SPO2 value
int8_t validSPO2; //indicator to show if the SPO2 calculation is valid
int32_t heartRate; //heart rate value
int8_t validHeartRate; //indicator to show if the heart rate calculation is valid

<<<<<<< HEAD

=======
>>>>>>> c0a21091f6e61340f5e9966fa3c9ac06d960140c
const byte RATE_SIZE = 4; //Increase this for more averaging. 4 is good.
byte rates[RATE_SIZE]; //Array of heart rates
byte rateSpot = 0;
long lastBeat = 0; //Time at which the last beat occurred

float beatsPerMinute;
int beatAvg;

//Internally stored read times
int read_time;
int start_time = 6;  //in military time
int end_time = 22;  //in military time
int interval = 30;  //in minutes

String dataObj;

//For internal storage of readings (up to 200)
String storedReadTimes[200]; //stores read times
int storedHeartRates[200];  //stores heart rates
int storedBloodOxygen[200];  //stores blook oxygen levels
int numStoredReadings = 0;  //holds number of current stored readings

//Function to handle when the /timeReq post request is returned
void timeHandler(const char *event, const char *data) {
  //Parse data string
  char* datastr = (char*)data;
  Serial.println(datastr);
  char* start = substr(datastr, 10, 2);
  char* end = substr(datastr, 21, 2);
  char* interv = substr(datastr, 37, 2);
  //Save the times
  Serial.print("\nSaving new intervals");
  start_time = atoi(start);
  end_time = atoi(end);
  interval = atoi(interv);
}

//Function to parse char*
char* substr(char* arr, int begin, int len){
  char* res = new char[len+1];
  for (int i=0; i<len; i++){
    res[i] = *(arr+begin+i);
  }
  res[len] = 0;
  return res;
}

//Function to handle the /healthData post request response
void dataHandler(const char *event, const char *data){
  Serial.println("Flashing green because successful save to server");
  //Blink the led green 5 times
  for (int i=0; i<5; i++){
    digitalWrite(greenPin, HIGH);
    delay(500);
    digitalWrite(greenPin, LOW);
    delay(500);
  }
}

//Function to check for locally stored readings and send them to the cloud
void loadSavedReadings(){
  Serial.println("\nchecking number of stored readings: ");
  Serial.print(numStoredReadings);
  //Check for any stored readins
  if(numStoredReadings > 0){
    Serial.println("Sending stored readings");
    //Loop through stored readins
    for(int i=0; i<numStoredReadings; i++){
      String object = String::format("{ \"heart_rate\": %d, \"spo2\": %d, \"read_time\": \""+storedReadTimes[i]+"\" }", storedHeartRates[i], storedBloodOxygen[i]);
      Serial.println(object);
      Particle.publish("healthData", object, PRIVATE);
    }
    //Clear the arrays
    for(int i=0; i<numStoredReadings; i++){
      storedBloodOxygen[i] = 0;
      storedHeartRates[i] = 0;
      storedReadTimes[i] = "";
    }
    numStoredReadings = 0;
  }
  else{
    Serial.println("No stored Readings available.");
    delay(1000);
  }
}

//Setup function
void setup()
{
  Serial.begin(115200); // initialize serial communication at 115200 bits per second:

  //Set Led pins to output
  pinMode(pulseLED, OUTPUT);
  pinMode(readLED, OUTPUT);

  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);


  // Initialize sensor

  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) //Use default I2C port, 400kHz speed
  {
    Serial.println(F("MAX30105 was not found. Please check wiring/power."));
    while (1);
  }

  //Set variables for I2C communication
  byte ledBrightness = 60; //Options: 0=Off to 255=50mA
  byte sampleAverage = 4; //Options: 1, 2, 4, 8, 16, 32
  byte ledMode = 2; //Options: 1 = Red only, 2 = Red + IR, 3 = Red + IR + Green
  byte sampleRate = 100; //Options: 50, 100, 200, 400, 800, 1000, 1600, 3200
  int pulseWidth = 411; //Options: 69, 118, 215, 411
  int adcRange = 4096; //Options: 2048, 4096, 8192, 16384

  particleSensor.setup(ledBrightness, sampleAverage, ledMode, sampleRate, pulseWidth, adcRange); //Configure sensor with these settings
  particleSensor.setPulseAmplitudeRed(0x0A); //Turn Red LED to low to indicate sensor is running
  particleSensor.setPulseAmplitudeGreen(0); //Turn off Green LED

  //Connect to the webhooks needed to send requests
  Particle.subscribe("hook-response/timeReq", timeHandler);
  Particle.subscribe("hook-response/healthData", dataHandler);
  //Change time zone to match Arizona's time
  Time.zone(-7);
}

void loop()

{
  
  //state 1 is doing nothing and waiting for the read time to come
  switch (state) {
    //This is the standby case
    case 1:{
      //Check if device is connected to the cloud
      if (Particle.connected() == true){
        Particle.publish("timeReq", "Request time intervals", PRIVATE);  //Request to get time start, end, and interval
        loadSavedReadings();  //Send stored readings
      }
      //Get time to reference
      int curr_time_in_secs = (Time.hour()*3600)+(Time.minute()*60)+Time.second();
      //Loop through all possible times we're supposed to read
      for(int i=0; i<((end_time-start_time)*(60/interval))+1; i++){
        int int_seconds = ((start_time*60)+(i*interval))*60;
        /*Serial.print("\ncurr time: ");
        Serial.print(curr_time_in_secs);
        Serial.print("\ncheck time: ");
        Serial.print(int_seconds);*/
        //Check if now is when we need to tell user to read
        if((curr_time_in_secs > int_seconds) && (curr_time_in_secs - int_seconds) < 30){    //Give 30 seconds of processing time
          Serial.println("changing state");
          read_time = int_seconds; //Save the read time for this sample
          state = 2;
          break;
        }  
      }
    }
      break;
    
    //This is waiting for the user to 
    case 2:{
      Serial.print("Please put finger on scanner and press any key to begin reading.");
      bool start = false;
      int ref_time = Time.hour()*3600+Time.minute()*60+Time.second();  //Get blink time start
      int curr_time;
      while(start == false){
        //Flash led blue
        digitalWrite(bluePin, HIGH);
        delay(1000);
        digitalWrite(bluePin, LOW);
        delay(1000);
        curr_time = Time.hour()*3600+Time.minute()*60+Time.second();
        //Check if finger is on sensor
        if(particleSensor.getIR()>50000){
          start = true;
          state = 3;
        }
        else if (curr_time-ref_time > 5*60){   //Check if 5 minutes have passed since the led started blinking
          start = true;
          state = 1;
        }
      }
      }
      break;
    //This is where the data is read
    case 3:{
      bufferLength = 100; //buffer length of 100 stores 4 seconds of samples running at 25sps
      long irValue = particleSensor.getIR(); //Get IR data
    
      if (checkForBeat(irValue) == true)
      {
        //We sensed a beat!
        long delta = millis() - lastBeat;
        lastBeat = millis();

        beatsPerMinute = 60 / (delta / 1000.0);

        if (beatsPerMinute < 255 && beatsPerMinute > 20)
        {
          rates[rateSpot++] = (byte)beatsPerMinute; //Store this reading in the array
          rateSpot %= RATE_SIZE; //Wrap variable

          //Take average of readings
          beatAvg = 0;
          for (byte x = 0 ; x < RATE_SIZE ; x++)
            beatAvg += rates[x];
          beatAvg /= RATE_SIZE;
        }
      }

      //Serial.print("IR=");
      //Serial.print(irValue);
      //Serial.print(", BPM=");
      //Serial.print(beatsPerMinute);
      //Serial.print(", Avg BPM=");
      //Serial.print(beatAvg);

      if (irValue < 50000)
        Serial.println(" No finger?");

      Serial.println();
      //read the first 100 samples, and determine the signal range
      particleSensor.check();
      Serial.println("new data");
      for (byte i = 0 ; i < bufferLength ; i++)
      {
        while (particleSensor.available() == 0){ //do we have new data?
          //Serial.print("Checking sensor ");
          particleSensor.check(); //Check the sensor for new data
        }
        redBuffer[i] = particleSensor.getRed();
        irBuffer[i] = particleSensor.getIR();
        particleSensor.nextSample(); //We're finished with this sample so move to next sample

        //Serial.print(F("red="));
        //Serial.print(redBuffer[i], DEC);
        //Serial.print(F(", ir="));
        //Serial.println(irBuffer[i], DEC);
      }

      //calculate heart rate and SpO2 after first 100 samples (first 4 seconds of samples)
      Serial.println("Calculating");
      maxim_heart_rate_and_oxygen_saturation(irBuffer, bufferLength, redBuffer, &spo2, &validSPO2, &heartRate, &validHeartRate);

      Serial.println("Entering constant data gathering");
      //Continuously taking samples from MAX30102.  Heart rate and SpO2 are calculated every 1 second
      for (int i=0; i<10; i++)   //Done to give time to settle down.
      {
        //dumping the first 25 sets of samples in the memory and shift the last 75 sets of samples to the top
        for (byte i = 25; i < 100; i++)
        {
          redBuffer[i - 25] = redBuffer[i];
          irBuffer[i - 25] = irBuffer[i];
        }

        //take 25 sets of samples before calculating the heart rate.
        for (byte i = 75; i < 100; i++)
        {
          while (particleSensor.available() == false){ //do we have new data?
            particleSensor.check(); //Check the sensor for new data
          }
          digitalWrite(readLED, !digitalRead(readLED)); //Blink onboard LED with every data read

          redBuffer[i] = particleSensor.getRed();
          irBuffer[i] = particleSensor.getIR();
          particleSensor.nextSample(); //We're finished with this sample so move to next sample
          }
        //After gathering 25 new samples recalculate HR and SP02
          maxim_heart_rate_and_oxygen_saturation(irBuffer, bufferLength, redBuffer, &spo2, &validSPO2, &heartRate, &validHeartRate);
        
        
        }

        //print calculated values
          Serial.print(F("HR="));
          Serial.print(heartRate, DEC);

          Serial.print(F(", HRvalid="));
          Serial.print(validHeartRate, DEC);

          Serial.print(F(", SPO2="));
          Serial.print(spo2, DEC);

          Serial.print(F(", SPO2Valid="));
          Serial.println(validSPO2, DEC);
          Serial.println();
        
        state = 4;
      }
      break;
    //This is the saving mode
    case 4:{
      Serial.println("case 4");
      //Check if readings were valid
      if( validHeartRate == 0 || validSPO2 == 0){
        state = 2;
      }
      else {
        if (Particle.connected() == true){  //Check if particle is connected to the cloud
          Serial.println("sending data to server");
          String date = String::format("%d-%d-%d %d:%d",Time.year(),Time.month(),Time.day(),Time.hour(),Time.minute());
          String object = String::format("{ \"heart_rate\": %d, \"spo2\": %d, \"read_time\": \""+date+"\" }", heartRate, spo2);
          Serial.println(object);
          Particle.publish("healthData", object, PRIVATE);  //Send post request through webhook
        }
        else {  //If the cloud was not available
          Serial.print("Saving Data Locally");
          storedHeartRates[numStoredReadings] = heartRate;  //Store heart rate
          storedBloodOxygen[numStoredReadings] = spo2;  //Store blood oxygen
          String date = String::format("%d-%d-%d %d:%d",Time.year(),Time.month(),Time.day(),Time.hour(),Time.minute());  
          storedReadTimes[numStoredReadings] = date;  //Store date
          numStoredReadings++;
          // Serial.print("\n");
          // Serial.print(storedBloodOxygen[0]);
          // Serial.print("\n");
          // Serial.print(numStoredReadings);
          for (int i = 0; i<5; i++){   //Flash led yellow 5 times
            digitalWrite(greenPin, 200);
            digitalWrite(redPin, 255);
            delay(500);
            digitalWrite(greenPin, 0);
            digitalWrite(redPin, 0);
            delay(500);
          }
        state = 1;  //Go back to the standby case
      }
      }
      }
      break;
    default:{
      Serial.print("Error");
      }
      break;
  }
} 