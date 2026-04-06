"""
GATE College Predictor - ML Model Training
==========================================
Uses 2025 cutoff data from 12 IIT PDFs.
Model: XGBoost classifier → predicts admission probability
"""

import json
import numpy as np
import pandas as pd
import pickle
import os
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score

# ── 1. Load data ──────────────────────────────────────────────────────────────
DATA_PATH = os.path.join(os.path.dirname(__file__), '../data/cutoffs_2025.json')
with open(DATA_PATH) as f:
    raw = json.load(f)

df = pd.DataFrame(raw)
print(f"✅ Loaded {len(df)} records from {df['college'].nunique()} colleges")
print(df.head())

# ── 2. Encode categorical columns ─────────────────────────────────────────────
le_college  = LabelEncoder()
le_program  = LabelEncoder()
le_category = LabelEncoder()

df['college_enc']  = le_college.fit_transform(df['college'])
df['program_enc']  = le_program.fit_transform(df['program'])
df['category_enc'] = le_category.fit_transform(df['category'])

# ── 3. Feature engineering ────────────────────────────────────────────────────
# Category difficulty factor (reservation lowers effective cutoff)
category_weight = {
    'GEN': 1.0, 'EWS': 0.93, 'OBC-NCL': 0.88,
    'SC': 0.75, 'ST': 0.68, 'PWD': 0.72
}
df['cat_weight'] = df['category'].map(category_weight).fillna(0.85)

# Normalised cutoff (0-1 scale within each college+program)
df['cutoff_norm'] = df.groupby(['college', 'program'])['cutoff'].transform(
    lambda x: (x - x.min()) / (x.max() - x.min() + 1e-6)
)

# ── 4. Prepare features & target ──────────────────────────────────────────────
features = ['college_enc', 'program_enc', 'category_enc', 'cat_weight', 'cutoff_norm']
X = df[features].values
y = df['cutoff'].values   # we predict the cutoff score

# ── 5. Train / test split ─────────────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# ── 6. Try XGBoost, fall back to sklearn GradientBoosting ────────────────────
try:
    from xgboost import XGBRegressor
    model = XGBRegressor(
        n_estimators=300,
        max_depth=5,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        verbosity=0
    )
    model_name = "XGBoost"
except ImportError:
    from sklearn.ensemble import GradientBoostingRegressor
    model = GradientBoostingRegressor(
        n_estimators=200,
        max_depth=5,
        learning_rate=0.05,
        random_state=42
    )
    model_name = "GradientBoosting (sklearn)"

print(f"\n🚀 Training {model_name} model...")
model.fit(X_train, y_train)

# ── 7. Evaluate ───────────────────────────────────────────────────────────────
preds = model.predict(X_test)
mae   = mean_absolute_error(y_test, preds)
r2    = r2_score(y_test, preds)
print(f"✅ MAE  : {mae:.2f} score points")
print(f"✅ R²   : {r2:.4f}")

# ── 8. Save model + encoders ──────────────────────────────────────────────────
SAVE_DIR = os.path.join(os.path.dirname(__file__), 'saved')
os.makedirs(SAVE_DIR, exist_ok=True)

pickle.dump(model,       open(f'{SAVE_DIR}/model.pkl',       'wb'))
pickle.dump(le_college,  open(f'{SAVE_DIR}/le_college.pkl',  'wb'))
pickle.dump(le_program,  open(f'{SAVE_DIR}/le_program.pkl',  'wb'))
pickle.dump(le_category, open(f'{SAVE_DIR}/le_category.pkl', 'wb'))

print(f"\n💾 Saved to {SAVE_DIR}/")
print("   model.pkl, le_college.pkl, le_program.pkl, le_category.pkl")
