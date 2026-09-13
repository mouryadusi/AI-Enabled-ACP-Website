"""
XGBoost adapter — engineered conflict-feature baseline.

Trained offline on the 72,841 aircraft interaction graphs described in the
dissertation, flattened to the feature vector in `app.inference.FEATURE_ORDER`.
Load a real booster with:

    import xgboost as xgb
    booster = xgb.Booster()
    booster.load_model(settings.XGBOOST_MODEL_PATH)

then call `booster.predict(xgb.DMatrix(feature_matrix))`.
"""
MODEL_NAME = "XGBoost"
F1 = 0.9994
ROC_AUC = 1.000
