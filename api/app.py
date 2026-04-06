"""
GATE Predictor - Flask REST API
================================
Endpoints:
  GET  /api/colleges          → list all unique colleges
  GET  /api/programs          → list all unique programs
  GET  /api/categories        → list all categories
  POST /api/predict           → main prediction endpoint

Run:
  pip install flask flask-cors scikit-learn xgboost
  python app.py
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sys, os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../model'))
from predict import predict_all, ALL_RECORDS

app = Flask(__name__)
CORS(app, origins=["https://gate-college-predictor-pink.vercel.app/", "*"])   # allow React dev server (localhost:5173) to call this

# ── helpers ──────────────────────────────────────────────────────────────────
def unique_sorted(field):
    return sorted(set(r[field] for r in ALL_RECORDS))

# ── routes ───────────────────────────────────────────────────────────────────
@app.route('/api/colleges')
def colleges():
    return jsonify(unique_sorted('college'))

@app.route('/api/programs')
def programs():
    return jsonify(unique_sorted('program'))

@app.route('/api/categories')
def categories():
    return jsonify(['GEN', 'OBC-NCL', 'EWS', 'SC', 'ST', 'PWD'])

@app.route('/api/predict', methods=['POST'])
def predict():
    body = request.get_json(force=True)
    score    = body.get('score')
    category = body.get('category', 'GEN')
    branch   = body.get('branch', '')

    # validation
    if score is None:
        return jsonify({'error': 'score is required'}), 400
    try:
        score = float(score)
    except ValueError:
        return jsonify({'error': 'score must be a number'}), 400
    if not (100 <= score <= 1000):
        return jsonify({'error': 'score must be between 100 and 1000'}), 400

    results = predict_all(score, category, branch)

    summary = {
        'safe':     sum(1 for r in results if r['chance'] == 'Safe'),
        'moderate': sum(1 for r in results if r['chance'] == 'Moderate'),
        'reach':    sum(1 for r in results if r['chance'] == 'Reach'),
        'total':    len(results)
    }

    return jsonify({'summary': summary, 'results': results})

@app.route('/api/health')
def health():
    return jsonify({'status': 'ok', 'records': len(ALL_RECORDS)})

# ── run ───────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    print("🚀  GATE Predictor API running on http://localhost:5000")
    app.run(debug=True, port=5000)
