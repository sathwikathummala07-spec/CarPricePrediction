import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


# ==========================================
# 1. LOAD DATASET
# ==========================================

df = pd.read_csv("dataset/car_data.csv")

print("Dataset loaded successfully!")
print("Shape:", df.shape)

print("\nColumns:")
print(df.columns.tolist())

print("\nFirst 5 rows:")
print(df.head())


# ==========================================
# 2. SEPARATE FEATURES AND TARGET
# ==========================================

X = df.drop(["Selling_Price", "Car_Name"], axis=1)
y = df["Selling_Price"]

print("\nFeatures:")
print(X.head())

print("\nTarget:")
print(y.head())


# ==========================================
# 3. ENCODE CATEGORICAL COLUMNS
# ==========================================

X = pd.get_dummies(
    X,
    columns=["Fuel_Type", "Seller_Type", "Transmission"],
    drop_first=True
)

print("\nEncoded Features:")
print(X.head())

print("\nFeature Columns:")
print(X.columns.tolist())


# ==========================================
# 4. TRAIN-TEST SPLIT
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

print("\nTraining data:", X_train.shape)
print("Testing data:", X_test.shape)


# ==========================================
# 5. CREATE RANDOM FOREST MODEL
# ==========================================

model = RandomForestRegressor(
    n_estimators=200,
    random_state=42
)


# ==========================================
# 6. TRAIN MODEL
# ==========================================

model.fit(X_train, y_train)

print("\nModel trained successfully!")


# ==========================================
# 7. MAKE PREDICTIONS
# ==========================================

y_pred = model.predict(X_test)


# ==========================================
# 8. EVALUATE MODEL
# ==========================================

mae = mean_absolute_error(y_test, y_pred)

rmse = np.sqrt(
    mean_squared_error(y_test, y_pred)
)

r2 = r2_score(y_test, y_pred)


print("\n================================")
print("MODEL EVALUATION")
print("================================")

print("MAE:", mae)
print("RMSE:", rmse)
print("R2 Score:", r2)


# ==========================================
# 9. ACTUAL VS PREDICTED
# ==========================================

results = pd.DataFrame({
    "Actual Price": y_test.values,
    "Predicted Price": y_pred
})

print("\nActual vs Predicted:")
print(results.head(10))


# ==========================================
# 10. SAVE TRAINED MODEL
# ==========================================

joblib.dump(model, "car_price_model.pkl")

print("\nModel saved successfully as car_price_model.pkl")


# ==========================================
# 11. SAVE FEATURE COLUMNS
# ==========================================

feature_columns = X.columns.tolist()

joblib.dump(feature_columns, "feature_columns.pkl")

print("Feature columns saved successfully as feature_columns.pkl")