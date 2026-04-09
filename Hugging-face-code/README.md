# 💧 LSTM Water Quality Forecasting

This project is an interactive web application built using **Gradio** for forecasting **Water Quality Index (WQI)** using a deep learning **LSTM (Long Short-Term Memory)** model.

It allows users to upload water quality datasets, train a model on-the-fly, and generate future WQI predictions.

Click here to try it yourself 👉 [My Space](https://huggingface.co/spaces/ishaantherguy/IPD_borewell_space)

---

## 🚀 Features

* Upload your own water quality dataset (CSV)
* Automatic preprocessing and WQI calculation
* LSTM-based time series forecasting
* Multi-step future prediction
* Interactive UI powered by Gradio

---

## 📂 Input Data Format

The uploaded CSV file must contain the following columns:

* `Date`
* `pH`
* `Turbidity`
* `DO`
* `TDS`
* `Conductivity`
* `Ammonia-N`

Example:

| Date       | pH  | Turbidity | DO  | TDS | Conductivity | Ammonia-N |
| ---------- | --- | --------- | --- | --- | ------------ | --------- |
| 2023-01-01 | 7.1 | 3.2       | 6.5 | 300 | 500          | 0.2       |

---

## ⚙️ How It Works

1. Data is cleaned and grouped by date
2. Missing values are handled using forward fill
3. WQI is computed as the average of key parameters
4. Data is normalized using MinMaxScaler
5. Sequences are created for time-series learning
6. An LSTM model is trained on the dataset
7. Future WQI values are predicted iteratively

---

## 🧠 Model Architecture

* LSTM (64 units, return sequences)
* LSTM (32 units)
* Dense layer (output)

The model is trained using:

* Loss: Mean Squared Error (MSE)
* Optimizer: Adam

---

## ▶️ Usage

1. Upload a CSV file
2. Click **"Train Model"**
3. Enter number of forecast steps
4. Click **"Predict"**

The app will output predicted WQI values.

---

## 📦 Requirements

See 

Main libraries used:

* TensorFlow / Keras
* Pandas
* NumPy
* Scikit-learn
* Gradio

---

## 🖥️ Application Code

The full implementation is available in [My Space](https://huggingface.co/spaces/ishaantherguy/IPD_borewell_space)

---

## ⚠️ Notes

* The model is trained dynamically on uploaded data, so performance depends on dataset quality
* Larger datasets may take longer to train
* This app is designed for demonstration and research purposes

---

## 🔮 Future Improvements

* Pre-trained model support (no retraining needed)
* Visualization of forecasts (graphs)
* Hyperparameter tuning
* Model saving/loading

---

## 🤝 Acknowledgements

Built using:

* TensorFlow/Keras for deep learning
* Gradio for UI deployment
* Pandas & NumPy for data processing

---

## 📜 License

This project is open-source and available for educational and research use.
