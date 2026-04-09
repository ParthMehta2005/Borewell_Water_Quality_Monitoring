 HEAD
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

# 💧 Quality Analysis of Borewell Water

## AVINYA Tech Expo Poster
![Project Banner](https://github.com/ParthMehta2005/Borewell_Water_Quality_Monitoring/blob/main/AVINYA%20POSTER%20IPD.png)


📄 **Research Paper:** [Quality Analysis of Borewell Water](https://www.researchgate.net/publication/400467685_Quality_analysis_of_borewell_water)

---

## 📌 Overview

Access to clean and safe drinking water is a fundamental necessity, especially in regions dependent on borewell groundwater. This project presents an **IoT + Machine Learning-based system** for **real-time monitoring and prediction of borewell water quality**.

The system integrates:
- Sensor-based data acquisition  
- Machine learning models for prediction  
- Real-time alerts via application interfaces  

---

## 🎯 Objectives

- Monitor key physicochemical parameters of borewell water  
- Predict Water Quality Index (WQI) using ML models  
- Provide real-time alerts for unsafe water conditions  
- Enable scalable and cost-effective water monitoring  

---

## 🧪 Parameters Monitored

The system analyzes the following key water quality indicators:

- pH  
- Dissolved Oxygen (DO)  
- Turbidity  
- Electrical Conductivity  
- Ammonia  
- Sulphate  
- Total Dissolved Solids (TDS)  
- Hardness  

---

## 🏗️ System Architecture

The system consists of four major layers:

### 1. Sensor Layer
- pH Sensor  
- Turbidity Sensor  
- TDS Sensor  
- Dissolved Oxygen Sensor  
- MQ-135 Gas Sensor  

### 2. Communication Layer
- Wi-Fi / ESP32  
- MQTT / HTTP APIs  

### 3. Server Layer
- Data ingestion & storage  
- ML pipeline  
- REST APIs  

### 4. Application Layer
- Mobile App  
- Web Dashboard  
- Alert System  

---

## 🤖 Machine Learning Models Used

We evaluated multiple forecasting models for WQI prediction:

- ARIMA  
- SARIMA  
- Prophet  
- LSTM  

### 📊 Key Result:
- **LSTM performed best**
  - Lowest RMSE, MAE, MAPE  
  - Most stable predictions  
  - Narrow confidence intervals  

---

## 📈 Dataset

- Source: Telangana State Open Data Portal  
- Time Span: **2018 – 2024**  

### Data Split:
- Training Set: 2018 – 2023  
- Testing Set: 2023 – 2024  

---

## ⚙️ Hardware Components

- ESP32 S3 Microcontroller  
- Arduino Uno  
- Breadboard & Jumper Wires  
- Sensors (pH, Turbidity, TDS, MQ-135, DO)

---

## 🚀 Features

- 📡 Real-time water monitoring  
- 📊 Predictive analytics using ML  
- 🔔 Threshold-based alerts  
- 🌐 Web + Mobile interface  
- 💡 Low-cost and scalable solution  

---

## 📊 Key Insights

- WQI values ranged between **110–126.5**, indicating unsafe water without treatment  
- Increasing trend suggests **deteriorating water quality**  
- IoT + ML significantly improves:
  - Early contamination detection  
  - Decision-making  
  - Monitoring efficiency  

---


## 🔮 Future Scope

- Advanced AI-based anomaly detection  
- Improved sensor calibration techniques  
- GIS-based groundwater mapping  
- Energy-efficient and portable systems  
- Large-scale deployment for smart water management  

---

## 🌍 Applications

- 🚜 Agriculture (irrigation quality assessment)  
- 🏠 Household water safety  
- 🏭 Industrial usage monitoring  
- 🏥 Public health improvement  

---

## 👨‍💻 Authors

- Ishaan Sheth  
- Jainam Gala  
- Parth Mehta  
- Kavya Shah  
- Kranti Ghag  
- Meera Narvekar  

**Department of Computer Engineering**  
Dwarkadas Jivanlal Sanghvi College of Engineering, Mumbai  

---

## 🙏 Acknowledgements

We thank our mentors, faculty, and contributors for their guidance, technical support, and resources that made this project possible.

---

## 📜 License

This project is based on academic research. Please cite the paper if you use this work.
 0bef8500770ae6b52854e50149c679818d4f340a
