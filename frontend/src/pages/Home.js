import React from 'react';

const Home = () => {
  return (
    <div style={styles.page}>
      <h1>Welcome to AquaRover Analytics</h1>
      <p style={styles.text}>
        Our product is an advanced aquatic rover designed for the comprehensive quality analysis of borewell water. 
        Equipped with state-of-the-art sensory technology, it navigates borewells to provide real-time, accurate environmental data.
      </p>
      
      <h3>Hardware & Sensors</h3>
      <ul style={styles.list}>
        <li><strong>Microcontroller:</strong> ESP32S3 - The brain of the rover, handling data collection and transmission.</li>
        <li><strong>DO Sensor:</strong> Measures Dissolved Oxygen levels.</li>
        <li><strong>pH Sensor:</strong> Determines the acidity or alkalinity of the water.</li>
        <li><strong>Turbidity Sensor:</strong> Measures water clarity and suspended particulates.</li>
        <li><strong>TDS Sensor:</strong> Calculates Total Dissolved Solids.</li>
        <li><strong>MQ135 Sensor:</strong> Detects Ammonia and other hazardous gases.</li>
      </ul>
    </div>
  );
};

const styles = {
  page: { padding: '20px', lineHeight: '1.6' },
  text: { fontSize: '18px' },
  list: { fontSize: '16px', backgroundColor: '#f4f4f9', padding: '20px 40px', borderRadius: '8px' }
};

export default Home;