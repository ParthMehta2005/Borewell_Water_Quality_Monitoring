const express = require('express');
const router = express.Router();
const WaterData = require('../models/WaterData');

// GET: Fetch the latest water quality data for the dashboard
router.get('/latest', async (req, res) => {
    try {
        const latestData = await WaterData.findOne().sort({ timestamp: -1 });
        if (!latestData) {
            return res.status(404).json({ message: 'No data found' });
        }
        res.json(latestData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Endpoint for ESP32S3 and ML Model to send data
// In a real scenario, the ESP32 sends raw data, a Python microservice calculates WQI via ML, 
// and then posts the final payload here. We'll assume the completed payload is sent here.
router.post('/sensor-data', async (req, res) => {
    try {
        const { do_sensor, ph_sensor, turbidity, tds, ammonia_mq135, wqi, classification } = req.body;
        
        const newData = new WaterData({
            do_sensor, ph_sensor, turbidity, tds, ammonia_mq135, wqi, classification
        });

        const savedData = await newData.save();
        res.status(201).json(savedData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;