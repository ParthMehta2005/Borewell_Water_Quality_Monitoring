const mongoose = require('mongoose');

const WaterDataSchema = new mongoose.Schema({
    do_sensor: { type: Number, required: true },
    ph_sensor: { type: Number, required: true },
    turbidity: { type: Number, required: true },
    tds: { type: Number, required: true },
    ammonia_mq135: { type: Number, required: true },
    wqi: { type: Number, required: true },
    classification: { 
        type: String, 
        enum: ['Drinkable', 'Irrigation', 'Sewage'], 
        required: true 
    },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WaterData', WaterDataSchema);