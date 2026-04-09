import pandas as pd
import numpy as np
import gradio as gr

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler

# ================================
# Sequence creator
# ================================
def create_sequences(data, seq_len=12):
    X, y = [], []
    for i in range(len(data) - seq_len):
        X.append(data[i:i+seq_len])
        y.append(data[i+seq_len])
    return np.array(X), np.array(y)

# ================================
# Train Model
# ================================
def train_model(file):
    try:
        df = pd.read_csv(file.name)
        df.columns = df.columns.str.strip()

        required_cols = [
            "Date", "pH", "Turbidity", "DO",
            "TDS", "Conductivity", "Ammonia-N"
        ]

        for col in required_cols:
            if col not in df.columns:
                return None, None, f"❌ Missing column: {col}"

        df["Date"] = pd.to_datetime(df["Date"])
        df = df.groupby("Date").mean().sort_index()
        df = df.ffill()

        # Create WQI
        df["WQI"] = df[[
            "pH", "Turbidity", "DO",
            "TDS", "Conductivity", "Ammonia-N"
        ]].mean(axis=1)

        data = df[[
            "pH", "Turbidity", "DO",
            "TDS", "Conductivity", "Ammonia-N", "WQI"
        ]]

        scaler = MinMaxScaler()
        scaled_data = scaler.fit_transform(data)

        seq_len = 12
        X, y = create_sequences(scaled_data, seq_len)

        model = Sequential([
            LSTM(64, return_sequences=True, input_shape=(seq_len, X.shape[2])),
            LSTM(32),
            Dense(X.shape[2])
        ])

        model.compile(optimizer='adam', loss='mse')
        model.fit(X, y, epochs=20, batch_size=8, verbose=0)

        return model, scaler, "✅ Model trained successfully!"

    except Exception as e:
        return None, None, str(e)

# ================================
# Predict Function
# ================================
def predict(model, scaler, file, steps):
    try:
        if model is None or scaler is None:
            return "❌ Train the model first!"

        steps = int(steps)

        df = pd.read_csv(file.name)
        df.columns = df.columns.str.strip()

        df["Date"] = pd.to_datetime(df["Date"])
        df = df.groupby("Date").mean().sort_index()
        df = df.ffill()

        df["WQI"] = df[[
            "pH", "Turbidity", "DO",
            "TDS", "Conductivity", "Ammonia-N"
        ]].mean(axis=1)

        data = df[[
            "pH", "Turbidity", "DO",
            "TDS", "Conductivity", "Ammonia-N", "WQI"
        ]]

        scaled_data = scaler.transform(data)

        seq_len = 12
        last_seq = scaled_data[-seq_len:]

        preds = []
        current_seq = last_seq.copy()

        for _ in range(steps):
            pred = model.predict(current_seq.reshape(1, seq_len, current_seq.shape[1]), verbose=0)[0]
            preds.append(pred)
            current_seq = np.vstack([current_seq[1:], pred])

        preds = scaler.inverse_transform(preds)

        result_df = pd.DataFrame(preds, columns=data.columns)

        return result_df[["WQI"]].round(2)

    except Exception as e:
        return str(e)

# ================================
# Gradio UI
# ================================
with gr.Blocks() as app:
    gr.Markdown("## 💧 LSTM Water Quality Forecast")

    file_input = gr.File(label="Upload CSV")
    steps_input = gr.Number(label="Forecast Steps")

    train_btn = gr.Button("Train Model")
    predict_btn = gr.Button("Predict")

    output = gr.Dataframe()

    status = gr.Textbox(label="Status")

    # State (stores model + scaler)
    model_state = gr.State()
    scaler_state = gr.State()

    train_btn.click(
        fn=train_model,
        inputs=file_input,
        outputs=[model_state, scaler_state, status]
    )

    predict_btn.click(
        fn=predict,
        inputs=[model_state, scaler_state, file_input, steps_input],
        outputs=output
    )

app.launch(ssr_mode=False)
