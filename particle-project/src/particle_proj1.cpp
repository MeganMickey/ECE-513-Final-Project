/******************************************************/
//       THIS IS A GENERATED FILE - DO NOT EDIT       //
/******************************************************/

#include "Particle.h"
#line 1 "c:/Users/megan/College/Senior/Web_Development/InClassActivities/Argon_setup/particle_proj1/src/particle_proj1.ino"
/*
 * Project particle_proj1
 * Description:
 * Author:
 * Date:
 */

void setup();
void loop();
#line 8 "c:/Users/megan/College/Senior/Web_Development/InClassActivities/Argon_setup/particle_proj1/src/particle_proj1.ino"
int counter = 0;
int LED = D7;

// setup() runs once, when the device is first turned on.
void setup() {
  // Put initialization like pinMode and begin functions here.
  pinMode(LED, OUTPUT);

}

// loop() runs over and over again, as quickly as it can execute.
void loop() {
  // The core of your code will likely live here.
  if (counter %2 == 0) digitalWrite(LED, HIGH);
  else digitalWrite(LED, LOW);
  counter++;
  delay(1000);
}