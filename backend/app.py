from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib

# Create Flask application
app = Flask(__name__)

# Allow React frontend to communicate with Flask
CORS(app)

# Load trained model
model = joblib.load("car_price_model.pkl")

# Load feature columns
feature_columns = joblib.load("feature_columns.pkl")


@app.route("/")
def home():
    return jsonify({
        "message": "Car Price Prediction API is running!"
    })


@app.route("/predict", methods=["POST"])
def predict():

    try:
        # Get data sent from frontend
        data = request.get_json()

        # Create input dataframe
        input_data = pd.DataFrame([{
            "Year": data["Year"],
            "Present_Price": data["Present_Price"],
            "Kms_Driven": data["Kms_Driven"],
            "Fuel_Type": data["Fuel_Type"],
            "Seller_Type": data["Seller_Type"],
            "Transmission": data["Transmission"],
            "Owner": data["Owner"]
        }])

        # Convert categorical columns into numerical columns
        input_data = pd.get_dummies(
            input_data,
            columns=["Fuel_Type", "Seller_Type", "Transmission"],
            drop_first=True
        )

        # Make sure input has exactly the same columns
        # as the columns used during training
        input_data = input_data.reindex(
            columns=feature_columns,
            fill_value=False
        )

        # Make prediction
        prediction = model.predict(input_data)[0]

        # Return prediction
        return jsonify({
            "predicted_price": round(float(prediction), 2)
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 400


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )