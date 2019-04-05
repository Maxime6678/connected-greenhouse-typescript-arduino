#include<dht.h>
#include <pt.h>

#define DHT11_PIN 3
#define LDR_PIN A0
#define LED_PIN 2
#define LED_2_PIN 4
#define LED_3_PIN 5

dht DHT;
static struct pt ptL;

void setup() {
  Serial.begin(9600);
  pinMode(LDR_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  pinMode(LED_2_PIN, OUTPUT);
  pinMode(LED_3_PIN, OUTPUT);

  PT_INIT(&ptL);
}

static int checkInfo(struct pt *pt) {
  static String cmd, id, incomming;
  PT_BEGIN(pt);
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
  } else if (cmd == "open") {
    digitalWrite(LED_PIN, HIGH);
    delay(2000);
    digitalWrite(LED_PIN, LOW);
  } else if (cmd == "water") {
    digitalWrite(LED_2_PIN, HIGH);
    delay(2000);
    digitalWrite(LED_2_PIN, LOW);
  } else if (cmd == "lamp") {
    digitalWrite(LED_3_PIN, HIGH);
    delay(2000);
    digitalWrite(LED_3_PIN, LOW);
  }
  PT_END(pt);
}

void loop() {
  if (Serial.available() > 0) {
    checkInfo(&ptL);
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
