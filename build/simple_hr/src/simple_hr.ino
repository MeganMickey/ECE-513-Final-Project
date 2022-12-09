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

int redPin = D7;
int greenPin = D6;
int bluePin = D5;
int redValue = 255;
int greenValue = 255;
int blueValue = 255;

byte pulseLED = 11; //Must be on PWM pin
byte readLED = 13; //Blinks with each data read

uint32_t irBuffer[100]; //infrared LED sensor data
uint32_t redBuffer[100];  //red LED sensor data

int32_t bufferLength; //data length
int32_t spo2; //SPO2 value
int8_t validSPO2; //indicator to show if the SPO2 calculation is valid
int32_t heartRate; //heart rate value
int8_t validHeartRate; //indicator to show if the heart rate calculation is valid

const byte RATE_SIZE = 4; //Increase this for more averaging. 4 is good.
byte rates[RATE_SIZE]; //Array of heart rates
byte rateSpot = 0;
long lastBeat = 0; //Time at which the last beat occurred

float beatsPerMinute;
int beatAvg;

int read_time;
int start_time = 6;
int end_time = 22;
int interval = 30;

String dataObj;

String storedReadTimes[200];
int storedHeartRates[200];
int storedBloodOxygen[200];
int numStoredReadings = 0;


void timeHandler(const char *event, const char *data) {
  char* datastr = (char*)data;
  Serial.println(datastr);
  char* start = substr(datastr, 10, 2);
  char* end = substr(datastr, 21, 2);
  char* interv = substr(datastr, 37, 2);

  Serial.print("\nSaving new intervals");
  start_time = atoi(start);
  end_time = atoi(end);
  interval = atoi(interv);
}

char* substr(char* arr, int begin, int len){
  char* res = new char[len+1];
  for (int i=0; i<len; i++){
    res[i] = *(arr+begin+i);
  }
  res[len] = 0;
  return res;
}

void dataHandler(const char *event, const char *data){
  Serial.println("Flashing green because successful save to server");
  for (int i=0; i<5; i++){
    digitalWrite(greenPin, HIGH);
    delay(500);
    digitalWrite(greenPin, LOW);
    delay(500);
  }
}

void loadSavedReadings(){
  Serial.println("\nchecking number of stored readings: ");
  Serial.print(numStoredReadings);
  if(numStoredReadings > 0){
    Serial.println("Sending stored readings");
    for(int i=0; i<numStoredReadings; i++){
      /*int curr_time_min = Time.hour()*3600+Time.minute()*60;
      int read_time_min = storedReadTimes[i]
      if(Time.second)*/
      String object = String::format("{ \"heart_rate\": %d, \"spo2\": %d, \"read_time\": \""+storedReadTimes[i]+"\" }", storedHeartRates[i], storedBloodOxygen[i]);
      Serial.println(object);
      Particle.publish("healthData", object, PRIVATE);
    }
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

void setup()
{
  Serial.begin(115200); // initialize serial communication at 115200 bits per second:

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

  //Serial.println(F("Attach sensor to finger with rubber band. Press any key to start conversion"));
  //while (Serial.available() == 0) Serial.print("waiting to start"); //wait until user presses a key
  //Serial.read();
  byte ledBrightness = 60; //Options: 0=Off to 255=50mA
  byte sampleAverage = 4; //Options: 1, 2, 4, 8, 16, 32
  byte ledMode = 2; //Options: 1 = Red only, 2 = Red + IR, 3 = Red + IR + Green
  byte sampleRate = 100; //Options: 50, 100, 200, 400, 800, 1000, 1600, 3200
  int pulseWidth = 411; //Options: 69, 118, 215, 411
  int adcRange = 4096; //Options: 2048, 4096, 8192, 16384

  particleSensor.setup(ledBrightness, sampleAverage, ledMode, sampleRate, pulseWidth, adcRange); //Configure sensor with these settings
  particleSensor.setPulseAmplitudeRed(0x0A); //Turn Red LED to low to indicate sensor is running
  particleSensor.setPulseAmplitudeGreen(0); //Turn off Green LED

  Particle.subscribe("hook-response/timeReq", timeHandler);
  Particle.subscribe("hook-response/healthData", dataHandler);
  Time.zone(-7);
}

void loop()

{
  
  //state 1 is doing nothing and waiting for the read time to come
  switch (state) {
    //This is the standby case
    case 1:{
      if (Particle.connected() == true){
        Particle.publish("timeReq", "Request time intervals", PRIVATE);
        loadSavedReadings();
      }
      int curr_time_in_secs = (Time.hour()*3600)+(Time.minute()*60)+Time.second();
      for(int i=0; i<((end_time-start_time)*(60/interval))+1; i++){
        int int_seconds = ((start_time*60)+(i*interval))*60;
        /*Serial.print("\ncurr time: ");
        Serial.print(curr_time_in_secs);
        Serial.print("\ncheck time: ");
        Serial.print(int_seconds);*/
        if((curr_time_in_secs > int_seconds) && (curr_time_in_secs - int_seconds) < 30){    //Give 30 seconds of processing time
          Serial.println("changing state");
          read_time = int_seconds;
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
      int ref_time = Time.hour()*3600+Time.minute()*60+Time.second();
      int curr_time;
      while(start == false){
        digitalWrite(bluePin, HIGH);
        delay(1000);
        digitalWrite(bluePin, LOW);
        delay(1000);
        curr_time = Time.hour()*3600+Time.minute()*60+Time.second();
        if(particleSensor.getIR()>50000){
          start = true;
          state = 3;
        }
        else if (curr_time-ref_time > 5*60){
          start = true;
          state = 1;
        }
      }
      }
      break;
    //This is where the data is read
    case 3:{
      bufferLength = 100; //buffer length of 100 stores 4 seconds of samples running at 25sps
      long irValue = particleSensor.getIR();

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
      for (int i=0; i<15; i++)   //Done to give time to settle down.
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

        //send samples and calculation result to terminal program through UART
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
      if (Particle.connected() == true){
        Serial.println("sending data to server");
        String date = String::format("%d-%d-%d %d:%d",Time.year(),Time.month(),Time.day(),Time.hour(),Time.minute());
        String object = String::format("{ \"heart_rate\": %d, \"spo2\": %d, \"read_time\": \""+date+"\" }", heartRate, spo2);
        Serial.println(object);
        Particle.publish("healthData", object, PRIVATE);
      }
      else {
        Serial.print("Saving Data Locally");
        storedHeartRates[numStoredReadings] = heartRate;
        storedBloodOxygen[numStoredReadings] = spo2;
        String date = String::format("%d-%d-%d %d:%d",Time.year(),Time.month(),Time.day(),Time.hour(),Time.minute());
        storedReadTimes[numStoredReadings] = date;
        numStoredReadings++;
        Serial.print("\n");
        Serial.print(storedBloodOxygen[0]);
        Serial.print("\n");
        Serial.print(numStoredReadings);
        for (int i = 0; i<5; i++){
          digitalWrite(greenPin, 50);
          digitalWrite(redPin, 255);
          delay(500);
          digitalWrite(greenPin, 0);
          digitalWrite(redPin, 0);
          delay(500);
        }
      }
      state = 1;
      }
      break;
    default:{
      Serial.print("Error");
      }
      break;
  }
} 