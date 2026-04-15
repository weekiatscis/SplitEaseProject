import os
from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

app = Flask(__name__)
CORS(app)

BALANCE_URL = os.getenv("NEXT_PUBLIC_BALANCE_API_BASE_URL")
CREDIT_TRANSFER_URL = os.getenv("NEXT_PUBLIC_CREDIT_TRANSFER_API_URL")
CREDIT_TRANSFER_API_KEY = os.getenv("CREDIT_TRANSFER_API_KEY")
PAYMENT_HISTORY_URL = os.getenv("NEXT_PUBLIC_PAYMENT_HISTORY_API_BASE_URL")


@app.route("/GetBalances", methods=["GET"])
def get_balances():
    resp = requests.get(f"{BALANCE_URL}/BalanceCalculating", params=request.args)
    try:
        return jsonify(resp.json()), resp.status_code
    except Exception:
        return resp.text, resp.status_code


@app.route("/CreditTransfer", methods=["POST"])
def credit_transfer():
    resp = requests.post(
        f"{CREDIT_TRANSFER_URL}/CreditTransfer",
        json=request.get_json(),
        headers={"X-contacts-Key": CREDIT_TRANSFER_API_KEY},
    )
    try:
        return jsonify(resp.json()), resp.status_code
    except Exception:
        return resp.text, resp.status_code


@app.route("/GetTransactionByUserId", methods=["GET"])
def get_transaction_by_user_id():
    resp = requests.get(f"{PAYMENT_HISTORY_URL}/GetTransactionByUserId", params=request.args)
    try:
        return jsonify(resp.json()), resp.status_code
    except Exception:
        return resp.text, resp.status_code


@app.route("/GetTransactionByGroupId", methods=["GET"])
def get_transaction_by_group_id():
    resp = requests.get(f"{PAYMENT_HISTORY_URL}/GetTransactionByGroupId", params=request.args)
    try:
        return jsonify(resp.json()), resp.status_code
    except Exception:
        return resp.text, resp.status_code


if __name__ == "__main__":
    app.run(port=5004, debug=True, use_reloader=False)
