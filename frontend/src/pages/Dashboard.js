import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLatestData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/data/latest');
      setData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Unable to fetch live data. Please ensure the backend is running.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestData();
    // Poll the server every 5 seconds for live updates
    const interval = setInterval(fetchLatestData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <h2>Loading Live Data...</h2>;
  if (error) return <h2 style={{ color: 'red' }}>{error}</h2>;
  if (!data) return <h2>Waiting for rover data...</h2>;

  const getStatusColor = (classification) => {
    switch (classification) {
      case 'Drinkable': return '#28a745'; // Green
      case 'Irrigation': return '#ffc107'; // Yellow
      case 'Sewage': return '#dc3545'; // Red
      default: return '#6c757d';
    }
  };

  return (
    <div style={styles.page}>
      <h1>Live Water Quality Dashboard</h1>
      
      <div style={{ ...styles.wqiCard, borderColor: getStatusColor(data.classification) }}>
        <h2 style={{ margin: 0 }}>Current Water Quality Index (WQI)</h2>
        <div style={styles.wqiValue}>{data.wqi.toFixed(2)}</div>
        <h3 style={{ color: getStatusColor(data.classification), fontSize: '28px', margin: '10px 0' }}>
          Status: {data.classification}
        </h3>
        <p>Last updated: {new Date(data.timestamp).toLocaleTimeString()}</p>
      </div>

      <div style={styles.sensorGrid}>
        <div style={styles.sensorCard}><strong>pH Level:</strong> {data.ph_sensor}</div>
        <div style={styles.sensorCard}><strong>Dissolved Oxygen:</strong> {data.do_sensor} mg/L</div>
        <div style={styles.sensorCard}><strong>Turbidity:</strong> {data.turbidity} NTU</div>
        <div style={styles.sensorCard}><strong>TDS:</strong> {data.tds} ppm</div>
        <div style={styles.sensorCard}><strong>Ammonia (MQ135):</strong> {data.ammonia_mq135} ppm</div>
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '20px', textAlign: 'center' },
  wqiCard: { border: '4px solid', borderRadius: '12px', padding: '30px', margin: '20px auto', maxWidth: '500px', backgroundColor: '#f8f9fa' },
  wqiValue: { fontSize: '64px', fontWeight: 'bold', color: '#343a40', margin: '10px 0' },
  sensorGrid: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px', marginTop: '30px' },
  sensorCard: { backgroundColor: '#e9ecef', padding: '20px', borderRadius: '8px', minWidth: '150px', fontSize: '18px' }
};

export default Dashboard;