#include<dht.h>
dht DHT;

#define DHT11_PIN 3
#define LDR_PIN A0

String incomming;

void setup() {
  Serial.begin(9600);
  pinMode(LDR_PIN, INPUT);
}

void loop() {
  /*int chk = DHT.read11(DHT11_PIN);
    Serial.println(" Humidity " );
    Serial.println(DHT.humidity, 1);
    Serial.println(" Temparature ");
    Serial.println(DHT.temperature, 1);
    delay(2000);*/

  if (Serial.available() > 0) {
    incomming = Serial.readString();
    String cmd = getValue(incomming, ':', 0);
    String id = getValue(incomming, ':', 1);
    int chk = DHT.read11(DHT11_PIN);

    if (cmd == "temp") {
      Serial.println(id + ":" + DHT.temperature);
    } else if (cmd == "hum") {
      Serial.println(id + ":" + DHT.humidity);
    } else if (cmd == "all") {
      Serial.println(id + ":" + DHT.temperature + "@" + DHT.humidity + "@" + getLux());
    } else if (cmd == "lux") {
      Serial.println(id + ":" + getLux());
    }

  }
}

String getLux() {
  int vout1 = analogRead(A0);
  float vout = vout1 / 204.6;
  float R = (11000 - vout * 2200) / vout;
  float lux = (pow( R, (1 / -0.8616))) / (pow( 10, (5.118 / -0.8616)));
  return String(lux);
}

String getTemp() {
  int chk = DHT.read11(DHT11_PIN);
  return String(DHT.temperature);
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
