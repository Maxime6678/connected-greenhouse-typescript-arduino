#include<dht.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#define DHT11_PIN 3
#define LDR_PIN A0
#define LED_PIN 2
#define LED_2_PIN 4
#define LED_3_PIN 5
#define MOT_IN1 9
#define MOT_IN2 10

LiquidCrystal_I2C lcd(0x27, 2, 1, 0, 4, 5, 6, 7, 3, POSITIVE);
dht DHT;
String command, id;
int temp, hum, lux;
boolean isMotorWork;
unsigned long checkTime;

void setup() {
  Serial.begin(115200);
  pinMode(LDR_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  pinMode(LED_2_PIN, OUTPUT);
  pinMode(LED_3_PIN, OUTPUT);
  pinMode(MOT_IN1, OUTPUT);
  pinMode(MOT_IN2, OUTPUT);

  digitalWrite(MOT_IN1, LOW);
  digitalWrite(MOT_IN2, LOW);

  lcd.begin(20,4);
  lcd.backlight();

  temp = 0;
  hum = 0;
  lux = 0;
  execRefresh();
}

void loop() {
  checkCommand();
  checkRefresh();
  showInfo();
}

void checkCommand() {
  if (Serial.available() > 0) {
     String incomming = Serial.readStringUntil('\n');
     command = getValue(incomming, ':', 0);
     id = getValue(incomming, ':', 1);
     execCommand(command, id);
  }
}

void execCommand(String a, String b) {
  if (a == "temp") {
    Serial.println(b + ":" + temp);
  } else if (a == "hum") {
    Serial.println(b + ":" + hum);
  } else if (a == "lux") {
    Serial.println(b + ":" + lux);
  } else if (a == "all") {
    Serial.println(b + ":" + temp + "@" + hum + "@" + lux);
  } else if (a == "open") {
    digitalWrite(LED_PIN, !digitalRead(LED_PIN));
  } else if (a == "water") {
    digitalWrite(LED_2_PIN, !digitalRead(LED_2_PIN));
  } else if (a == "lamp") {
    digitalWrite(LED_3_PIN, !digitalRead(LED_3_PIN));
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
}

void showInfo() {
  lcd.setCursor(0, 0);
  lcd.print("Temperature: ");
  lcd.print(temp);
  lcd.setCursor(0, 1);
  lcd.print("Humidite: ");
  lcd.print(hum);
  lcd.setCursor(0, 2);
  lcd.print("Lumiere: ");
  lcd.print(lux);
  lcd.setCursor(0, 3);
  lcd.print("Mode automatique");
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
