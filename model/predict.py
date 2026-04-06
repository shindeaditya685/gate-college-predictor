"""
GATE College Predictor - Prediction Engine
==========================================
predict_all(user_score, category, branch_keyword)
  → list of dicts with admission probability for each matching program
"""

import json, pickle, os, re
import numpy as np

BASE = os.path.dirname(os.path.abspath(__file__))

# ── Load encoders + model ─────────────────────────────────────────────────────
def _load(name):
    path = os.path.join(BASE, 'saved', name)
    if not os.path.exists(path):
        raise FileNotFoundError(f"Run train.py first – missing {path}")
    return pickle.load(open(path, 'rb'))

model       = _load('model.pkl')
le_college  = _load('le_college.pkl')
le_program  = _load('le_program.pkl')
le_category = _load('le_category.pkl')

# ── Load raw data for lookup ──────────────────────────────────────────────────
DATA_PATH = os.path.join(BASE, '..', 'data', 'cutoffs_2025.json')
with open(DATA_PATH) as f:
    ALL_RECORDS = json.load(f)

CATEGORY_WEIGHT = {
    'GEN': 1.0, 'EWS': 0.93, 'OBC-NCL': 0.88,
    'SC': 0.75, 'ST': 0.68, 'PWD': 0.72
}

def _safe_encode(le, val):
    """Return encoded value or -1 if unseen."""
    try:
        return le.transform([val])[0]
    except ValueError:
        return -1

def _admission_probability(user_score: float, predicted_cutoff: float) -> float:
    """Convert score-vs-cutoff difference into a 0-100 probability."""
    diff = user_score - predicted_cutoff
    if diff >= 50:   return min(97, 80 + diff * 0.2)
    if diff >= 20:   return 65 + diff * 0.5
    if diff >= 0:    return 50 + diff * 0.5
    if diff >= -30:  return max(15, 45 + diff * 0.8)
    return max(5, 20 + diff * 0.3)

def _chance_label(prob: float) -> str:
    if prob >= 70:  return "Safe"
    if prob >= 40:  return "Moderate"
    return "Reach"

def predict_all(user_score: float, category: str, branch_keyword: str = "") -> list:
    """
    Parameters
    ----------
    user_score     : GATE score (0–1000)
    category       : one of GEN, OBC-NCL, EWS, SC, ST, PWD
    branch_keyword : keyword to filter programs, e.g. "computer", "electrical"

    Returns
    -------
    list of dicts sorted by probability descending
    """
    results = []
    kw = branch_keyword.lower().strip()

    for rec in ALL_RECORDS:
        if rec['category'] != category:
            continue
        if kw and kw not in rec['program'].lower() and kw not in rec['college'].lower():
            continue

        college_enc  = _safe_encode(le_college,  rec['college'])
        program_enc  = _safe_encode(le_program,  rec['program'])
        category_enc = _safe_encode(le_category, rec['category'])
        cat_weight   = CATEGORY_WEIGHT.get(category, 0.85)

        if college_enc == -1 or program_enc == -1 or category_enc == -1:
            predicted_cutoff = rec['cutoff']   # fallback to raw
        else:
            feat = np.array([[college_enc, program_enc, category_enc, cat_weight, 0.5]])
            predicted_cutoff = float(model.predict(feat)[0])

        prob  = _admission_probability(user_score, rec['cutoff'])
        label = _chance_label(prob)
        diff  = user_score - rec['cutoff']

        results.append({
            'college':           rec['college'],
            'program':           rec['program'],
            'category':          category,
            'actual_cutoff':     rec['cutoff'],
            'predicted_cutoff':  round(predicted_cutoff, 1),
            'your_score':        user_score,
            'difference':        round(diff, 1),
            'probability':       round(prob, 1),
            'chance':            label,
            'apply':             label in ('Safe', 'Moderate')
        })

    results.sort(key=lambda x: x['probability'], reverse=True)
    return results


# ── CLI quick-test ────────────────────────────────────────────────────────────
if __name__ == '__main__':
    score    = float(input("Your GATE score: "))
    category = input("Category (GEN/OBC-NCL/SC/ST/EWS/PWD): ").strip()
    branch   = input("Branch keyword (leave blank for all): ").strip()

    results = predict_all(score, category, branch)

    print(f"\n{'College':<30} {'Program':<40} {'Cutoff':>7} {'Prob%':>7} {'Chance'}")
    print("-" * 95)
    for r in results[:20]:
        print(f"{r['college']:<30} {r['program']:<40} {r['actual_cutoff']:>7} {r['probability']:>6}% {r['chance']}")
