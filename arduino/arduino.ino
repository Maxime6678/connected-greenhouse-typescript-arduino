#include<dht.h>

#define DHT11_PIN 3
#define LDR_PIN A0
#define LED_PIN 2
#define LED_2_PIN 4
#define LED_3_PIN 5
#define MOT_IN1 9
#define MOT_IN2 10

dht DHT;
String command, id;
int temp, hum, lux;
boolean isMotorWork;
unsigned long checkTime;

void setup() {
  Serial.begin(9600);
  pinMode(LDR_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  pinMode(LED_2_PIN, OUTPUT);
  pinMode(LED_3_PIN, OUTPUT);
  pinMode(MOT_IN1, OUTPUT);
  pinMode(MOT_IN2, OUTPUT);

  digitalWrite(MOT_IN1, LOW);
  digitalWrite(MOT_IN2, LOW);

  temp = 0;
  hum = 0;
  lux = 0;
  execRefresh();
}

void loop() {
  checkCommand();
  checkRefresh();
}

void checkCommand() {
  if (Serial.available() > 0) {
    getCommand(command, id);
    execCommand(command, id);
  }
}

void getCommand(String &a, String &b) {
  String incomming = Serial.readString();
  a = getValue(incomming, ':', 0);
  b = getValue(incomming, ':', 1);
}

void execCommand(String &a, String &b) {
  if (a == "temp") {
    Serial.println(b + ":" + temp);
  } else if (a == "hum") {
    Serial.println(b + ":" + hum);
  } else if (a == "lux") {
    Serial.println(b + ":" + lux);
  } else if (a == "all") {
    Serial.println(b + ":" + temp + "@" + hum + "@" + lux);
  }
}

void checkRefresh() {
  if ((millis() - checkTime) > 5000) {
    execRefresh();
  }
}

void execRefresh() {
  checkTime = millis();
  DHT.read11(DHT11_PIN);
  temp = getTemp();
  hum = getHum();
  lux = getLux();
  Serial.println(lux);
}

int getTemp() {
  return DHT.temperature;
}

int getHum() {
  return DHT.humidity;
}

int getLux() {
  int vout1 = analogRead(A0);
  float vout = vout1 / 204.6;
  float R = (11000 - vout * 2200) / vout;
  float lux = (pow( R, (1 / -0.8616))) / (pow( 10, (5.118 / -0.8616)));
  return lux;
}

String getValue(String data, char separator, int index) {
  int found = 0;
  int strIndex[] = {0, -1};
  int maxIndex = data.length() - 1;

  for (int i = 0; i <= maxIndex && found <= index; i++) {
    if (data.charAt(i) == separator || i == maxIndex) {
      found++;
      strIndex[0] = strIndex[1] + 1;
      strIndex[1] = (i == maxIndex) ? i + 1 : i;
    }
  }

  return found > index ? data.substring(strIndex[0], strIndex[1]) : "";
}
