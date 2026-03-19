import React from 'react';

const HowItWorks = () => {
  return (
    <div style={styles.page}>
      <h1>How It Works</h1>
      
      <div style={styles.card}>
        <h3>1. Data Collection</h3>
        <p>The 5 sensors (DO, pH, Turbidity, TDS, and MQ135) are wired to the analog and digital GPIO pins of the <strong>ESP32S3 microcontroller</strong> onboard the rover. As the rover traverses the borewell, the ESP32S3 continuously reads voltage values and converts them into physical metrics.</p>
      </div>

      <div style={styles.card}>
        <h3>2. Real-Time Transmission</h3>
        <p>Using its built-in Wi-Fi capabilities, the ESP32S3 packages the sensor data into a JSON payload and transmits it via HTTP/MQTT protocols to our cloud server.</p>
      </div>

      <div style={styles.card}>
        <h3>3. Machine Learning & WQI Calculation</h3>
        <p>Once the cloud server receives the data, it is passed through a trained Machine Learning model. The ML model evaluates the complex non-linear relationships between the 5 parameters to output a definitive <strong>Water Quality Index (WQI)</strong>.</p>
      </div>

      <div style={styles.card}>
        <h3>4. Classification</h3>
        <p>Based on the calculated WQI, the system classifies the borewell water into one of three categories:</p>
        <ul>
          <li><strong>Drinkable:</strong> Safe for human consumption.</li>
          <li><strong>Irrigation:</strong> Safe for agricultural use.</li>
          <li><strong>Sewage:</strong> Highly contaminated, requires extensive treatment.</li>
        </ul>
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '20px', lineHeight: '1.6' },
  card: { backgroundColor: '#e9ecef', padding: '15px 25px', borderRadius: '8px', marginBottom: '15px' }
};

export default HowItWorks;