#define SENSOR_PIN A0

int n = 25;              // Number of samples to average for stability
int sensorValue = 0;

float voltage = 0.0;
float turbidity = 0.0;

// 🛑 VERY IMPORTANT: Your Calibration Value 🛑
// Based on your last test, clean water was around 0.95V to 1.01V.
// We will start with 0.98V, but you must tune this!
float Vclear = 0.98;     

void setup() {
  Serial.begin(9600);
  Serial.println("Turbidity Sensor Starting...");
  delay(2000);
}

void loop() {
  int sum = 0;

  // 1. Take multiple readings to average out noise
  for (int i = 0; i < n; i++) {
    sum += analogRead(SENSOR_PIN);
    delay(10);
  }

  sensorValue = sum / n;

  // 2. Convert analog reading (0-1023) to voltage (0-5V)
  voltage = sensorValue * (5.0 / 1023.0);

  // 3. Calculate Turbidity Percentage
  if (Vclear > 0) {
    turbidity = 100.0 - (voltage / Vclear) * 100.0;
  } else {
    turbidity = 0;
  }

  // 4. Clamp values so it doesn't show negative % or over 100%
  if (turbidity < 0) turbidity = 0;
  if (turbidity > 100) turbidity = 100;

  // 5. Print output to Serial Monitor
  Serial.print("Raw: ");
  Serial.print(sensorValue);
  
  Serial.print(" | Voltage: ");
  Serial.print(voltage, 3);
  
  Serial.print(" V | Turbidity: ");
  Serial.print(turbidity, 2);
  
  Serial.print(" % | Vclear: ");
  Serial.println(Vclear, 3);

  delay(1000);
}
