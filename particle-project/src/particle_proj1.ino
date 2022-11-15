/*
 * Project particle_proj1
 * Description:
 * Author:
 * Date:
 */

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