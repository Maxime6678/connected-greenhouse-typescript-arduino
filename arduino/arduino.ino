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

const String DEFAULT_STATE = "Mode automatique ...";
const String OPEN_STATE = "<!> Serre ouverture";
const String OPENED_STATE = "<!> Serre ouverte";
const String CLOSE_STATE = "<!> Serre fermeture";
const String WATER_STATE = "<!> Arrosage ...";
const String LAMP_STATE = "<!> Eclairage ...";

LiquidCrystal_I2C lcd(0x27, 2, 1, 0, 4, 5, 6, 7, 3, POSITIVE);
dht DHT;
String command, id, state, lastState;
int temp, hum, lux;
boolean isMotor = false, isWater = false, isLamp = false, isOpen = false;
unsigned long checkTime, motTime, waterTime;

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

  lcd.begin(20, 4);
  lcd.backlight();

  temp = 0;
  hum = 0;
  lux = 0;
  state = DEFAULT_STATE;
  lastState = state;
  execRefresh();
}

void loop() {
  checkCommand();
  checkRefresh();
  checkMot();
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
    isOpen ? closeHouse() : openHouse();
  } else if (a == "water") {
    startWater();
  } else if (a == "lamp") {
    isLamp ? stopLamp() : startLamp();
  } else if (a == "status") {
    Serial.println(b + ":" + isOpen + "@" + isWater + "@" + isLamp);
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
  state = getState();
  if (lastState != state) {
    lastState = state;
    lcd.clear();
  }
  lcd.setCursor(0, 0);
  lcd.print("Temperature: ");
  lcd.print(temp);
  lcd.print((char)223);
  lcd.print("c");
  lcd.setCursor(0, 1);
  lcd.print("Humidite: ");
  lcd.print(hum);
  lcd.print("%");
  lcd.setCursor(0, 2);
  lcd.print("Lumiere: ");
  lcd.print(lux);
  lcd.print(" lux    ");
  lcd.setCursor(0, 3);
  lcd.print(state);
}

void openHouse() {
  if (isMotor) return;
  digitalWrite(LED_PIN, !isMotor);
  // digitalWrite(Mot, HIGH);
  
  isOpen = true;
  isMotor = true;
  motTime = millis();
}

void closeHouse() {
  if (isMotor) return;
  digitalWrite(LED_PIN, !isMotor);
  // digitalWrite(Mot, HIGH);
  
  isOpen = false;
  isMotor = true;
  motTime = millis();
}

void startWater() {
  if (isWater) return;
  digitalWrite(LED_2_PIN, !isWater);
  
  isWater = true;
  waterTime = millis();
}

void stopWater() {
  if (!isWater) return;
  digitalWrite(LED_2_PIN, !isWater);
  
  isWater = false;
}

void startLamp() {
  if (isLamp) return;
  digitalWrite(LED_3_PIN, !isLamp);
  isLamp = true;
}

void stopLamp() {
  if (!isLamp) return;
  digitalWrite(LED_3_PIN, !isLamp);
  isLamp = false;
}

void checkMot() {
  if (isMotor && (millis() - motTime) > 250) digitalWrite(MOT_IN1, 60);
  if (isMotor && (millis() - motTime) > 500) digitalWrite(MOT_IN1, 120);
  if (isMotor && (millis() - motTime) > 750) digitalWrite(MOT_IN1, 180);
  if (isMotor && (millis() - motTime) > 1000) digitalWrite(MOT_IN1, 255);
  if (isMotor && (millis() - motTime) > 4250) digitalWrite(MOT_IN1, 180);
  if (isMotor && (millis() - motTime) > 4500) digitalWrite(MOT_IN1, 120);
  if (isMotor && (millis() - motTime) > 4750) digitalWrite(MOT_IN1, 60);
  
  if (isMotor && (millis() - motTime) > 5000) {
    digitalWrite(LED_PIN, !isMotor);
    // digitalWrite(Mot, LOW);
    isMotor = false;
  }

  if(isWater && (millis() - waterTime) > 15000) stopWater();
}

String getState(){
  if (isMotor && isOpen) return OPEN_STATE;
  if (isMotor && !isOpen) return CLOSE_STATE;
  if (isWater) return WATER_STATE;
  if (isOpen && !isMotor) return OPENED_STATE;
  if (isLamp) return LAMP_STATE;
  return DEFAULT_STATE;
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
