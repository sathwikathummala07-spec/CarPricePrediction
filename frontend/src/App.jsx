import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    Year: "",
    Present_Price: "",
    Kms_Driven: "",
    Fuel_Type: "Petrol",
    Seller_Type: "Dealer",
    Transmission: "Manual",
    Owner: "0",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setPrediction(null);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Year: Number(formData.Year),
          Present_Price: Number(formData.Present_Price),
          Kms_Driven: Number(formData.Kms_Driven),
          Fuel_Type: formData.Fuel_Type,
          Seller_Type: formData.Seller_Type,
          Transmission: formData.Transmission,
          Owner: Number(formData.Owner),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Prediction failed");
      }

      setPrediction(data.predicted_price);
    } catch (err) {
      setError(
        "Unable to connect to the prediction server. Please make sure Flask is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">🚗</div>

          <div>
            <h1>Car Price Prediction</h1>
            <p>Predict the resale value of your car using Machine Learning</p>
          </div>
        </div>
      </header>


      {/* Main Content */}
      <main className="container">

        <div className="card">

          <div className="card-header">
            <h2>Enter Car Details</h2>
            <p>
              Provide the details below to estimate the selling price.
            </p>
          </div>


          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              {/* Manufacturing Year */}
              <div className="form-group">
                <label>Manufacturing Year</label>

                <input
                  type="number"
                  name="Year"
                  value={formData.Year}
                  onChange={handleChange}
                  placeholder="e.g. 2018"
                  required
                />
              </div>


              {/* Present Price */}
              <div className="form-group">
                <label>Present Price (Lakhs)</label>

                <input
                  type="number"
                  step="0.01"
                  name="Present_Price"
                  value={formData.Present_Price}
                  onChange={handleChange}
                  placeholder="e.g. 9.85"
                  required
                />
              </div>


              {/* Kilometers */}
              <div className="form-group">
                <label>Kilometers Driven</label>

                <input
                  type="number"
                  name="Kms_Driven"
                  value={formData.Kms_Driven}
                  onChange={handleChange}
                  placeholder="e.g. 6900"
                  required
                />
              </div>


              {/* Fuel */}
              <div className="form-group">
                <label>Fuel Type</label>

                <select
                  name="Fuel_Type"
                  value={formData.Fuel_Type}
                  onChange={handleChange}
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="CNG">CNG</option>
                </select>
              </div>


              {/* Seller */}
              <div className="form-group">
                <label>Seller Type</label>

                <select
                  name="Seller_Type"
                  value={formData.Seller_Type}
                  onChange={handleChange}
                >
                  <option value="Dealer">Dealer</option>
                  <option value="Individual">Individual</option>
                </select>
              </div>


              {/* Transmission */}
              <div className="form-group">
                <label>Transmission</label>

                <select
                  name="Transmission"
                  value={formData.Transmission}
                  onChange={handleChange}
                >
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>


              {/* Owner */}
              <div className="form-group">
                <label>Previous Owners</label>

                <select
                  name="Owner"
                  value={formData.Owner}
                  onChange={handleChange}
                >
                  <option value="0">0 Owners</option>
                  <option value="1">1 Owner</option>
                  <option value="3">3 Owners</option>
                </select>
              </div>

            </div>


            {/* Button */}
            <button
              type="submit"
              className="predict-button"
              disabled={loading}
            >
              {loading ? "Predicting..." : "Predict Car Price"}
            </button>

          </form>


          {/* Prediction */}
          {prediction !== null && (
            <div className="result-card">

              <p>Estimated Selling Price</p>

              <h2>₹ {prediction} Lakhs</h2>

              <span>
                Based on the details you provided
              </span>

            </div>
          )}


          {/* Error */}
          {error && (
            <div className="error">
              {error}
            </div>
          )}

        </div>

      </main>

    </div>
  );
}

export default App;