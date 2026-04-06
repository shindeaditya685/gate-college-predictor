# GATE College Predictor

ML-powered IIT admission predictor using real 2025 COAP/CCMT cutoff data.
Covers 12 IITs: Jammu, Roorkee, Madras, Kharagpur, Jodhpur, Hyderabad,
Guwahati, Goa, Gandhinagar, Dharwad, BHU Varanasi, Bhilai.

---

## Project Structure

```
gate-predictor/
├── data/
│   └── cutoffs_2025.json       ← extracted from your 12 PDFs
├── model/
│   ├── train.py                ← trains + saves the ML model
│   ├── predict.py              ← prediction engine (importable)
│   └── saved/                  ← auto-created by train.py
│       ├── model.pkl
│       ├── le_college.pkl
│       ├── le_program.pkl
│       └── le_category.pkl
├── api/
│   ├── app.py                  ← Flask REST API
│   └── requirements.txt
└── frontend/
    └── src/
        ├── App.jsx
        └── components/
            ├── InputForm.jsx
            └── SummaryCards.jsx     
            └── FilterBar.jsx       
            └── ResultsTable.jsx       
```

---

## Setup — Step by Step

### 1. Open the project in VS Code

```bash
code gate-predictor
```

### 2. Set up the Python backend

```bash
cd api
pip install -r requirements.txt
```

### 3. Train the ML model

```bash
cd ../model
python train.py
```

You should see output like:
```
✅ Loaded 280 records from 12 colleges
✅ MAE  : 12.4 score points
✅ R²   : 0.9821
💾 Saved to model/saved/
```

### 4. Run the Flask API

```bash
cd ../api
python app.py
```

API will start at http://localhost:5000

Test it:
```bash
curl http://localhost:5000/api/health
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"score": 720, "category": "GEN", "branch": "computer"}'
```

### 5. Set up the React frontend

```bash
cd ../frontend

# if you haven't created the Vite project yet:
npm create vite@latest . -- --template react
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

npm run dev
```

Open http://localhost:5173 — the app will call the Flask API automatically.

---

## API Reference

| Method | Endpoint         | Description              |
|--------|-----------------|--------------------------|
| GET    | /api/health     | Check API is running     |
| GET    | /api/colleges   | List all colleges        |
| GET    | /api/categories | List all categories      |
| POST   | /api/predict    | Get admission predictions|

### POST /api/predict

Request body:
```json
{
  "score": 720,
  "category": "GEN",
  "branch": "computer"
}
```

Response:
```json
{
  "summary": { "safe": 5, "moderate": 8, "reach": 12, "total": 25 },
  "results": [
    {
      "college": "IIT Guwahati",
      "program": "Computer Science & Engineering",
      "category": "GEN",
      "actual_cutoff": 743,
      "predicted_cutoff": 741.2,
      "your_score": 720,
      "difference": -23,
      "probability": 31.6,
      "chance": "Reach",
      "apply": false
    },
    ...
  ]
}
```

---

## How the ML Model Works

1. **Features**: College (encoded), Program (encoded), Category (encoded),
   Category weight (GEN=1.0, OBC=0.88, SC=0.75...), Normalised cutoff position

2. **Model**: XGBoost Regressor (falls back to sklearn GradientBoosting
   if XGBoost not installed)

3. **Prediction**: Model predicts the expected cutoff → probability is computed
   from the gap between your score and predicted cutoff

4. **Chance Labels**:
   - **Safe** (≥70%): Your score is well above cutoff — definitely apply
   - **Moderate** (40–70%): Close to cutoff — worth applying
   - **Reach** (<40%): Below cutoff — unlikely but possible

---

## Adding More Data

To add more colleges or years:

1. Add entries to `data/cutoffs_2025.json` following the same format:
   ```json
   { "college": "NIT Trichy", "type": "NIT", "program": "...", "category": "GEN", "cutoff": 700 }
   ```

2. Retrain: `python model/train.py`

3. Restart the API: `python api/app.py`

---

## Tech Stack

| Layer    | Technology              |
|----------|------------------------|
| ML model | XGBoost / sklearn      |
| Backend  | Flask + Flask-CORS     |
| Frontend | React + Vite + Tailwind|
| Data     | JSON (from PDFs)       |
