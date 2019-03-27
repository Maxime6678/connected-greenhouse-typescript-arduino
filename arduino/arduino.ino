#include<dht.h>

#define DHT11_PIN 3
#define LDR_PIN A0

dht DHT;

void setup() {
  Serial.begin(9600);
  pinMode(LDR_PIN, INPUT);
}

void loop() {
  String cmd, id, incomming;
  if (Serial.available() > 0) {
    incomming = Serial.readString();
    cmd = getValue(incomming, ':', 0);
    id = getValue(incomming, ':', 1);
    if (cmd == "temp") {
      DHT.read11(DHT11_PIN);
      Serial.println(id + ":" + getTemp());
    } else if (cmd == "hum") {
      DHT.read11(DHT11_PIN);
      Serial.println(id + ":" + getHum());
    } else if (cmd == "all") {
      DHT.read11(DHT11_PIN);
      Serial.println(id + ":" + getTemp() + "@" + getHum() + "@" + getLux());
    } else if (cmd == "lux") {
      Serial.println(id + ":" + getLux());
    }
  }
}

int getTemp() {
  return DHT.temperature;
}

int getHum() {
  return DHT.humidity;
}

String getLux() {
  int vout1 = analogRead(A0);
  float vout = vout1 / 204.6;
  float R = (11000 - vout * 2200) / vout;
  float lux = (pow( R, (1 / -0.8616))) / (pow( 10, (5.118 / -0.8616)));
  return String(lux);
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
