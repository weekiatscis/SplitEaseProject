import os
from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

app = Flask(__name__)
CORS(app)

BASE_URL = os.getenv("NEXT_PUBLIC_EXPENSE_API_BASE_URL")
PAY_EXPENSE_URL = os.getenv("NEXT_PUBLIC_PAY_EXPENSE_API_URL", "")


def forward(path, method, params=None, json=None):
    url = f"{BASE_URL}/{path}"
    resp = requests.request(method, url, params=params, json=json)
    try:
        return jsonify(resp.json()), resp.status_code
    except Exception:
        return resp.text, resp.status_code


@app.route("/expenses/CreateExpenseEvenSplit", methods=["POST"])
def create_expense():
    return forward("expenses/CreateExpenseEvenSplit", "POST", json=request.get_json())


@app.route("/GetGroupSummary", methods=["GET"])
def get_group_summary():
    return forward("GetGroupSummary", "GET", params=request.args)


@app.route("/DeleteExpense", methods=["DELETE"])
def delete_expense():
    return forward("DeleteExpense", "DELETE", params=request.args)


@app.route("/GetExpensesSplit", methods=["GET"])
def get_expenses_split():
    return forward("GetExpensesSplit", "GET", params=request.args)


@app.route("/GetExpensesSplitSummary", methods=["GET"])
def get_expenses_split_summary():
    return forward("GetExpensesSplitSummary", "GET", params=request.args)


@app.route("/PayExpense", methods=["POST"])
def pay_expense():
    if not PAY_EXPENSE_URL:
        return jsonify({"error": "PAY_EXPENSE_URL is not configured"}), 500
    resp = requests.post(PAY_EXPENSE_URL, json=request.get_json())
    try:
        return jsonify(resp.json()), resp.status_code
    except Exception:
        return resp.text, resp.status_code


if __name__ == "__main__":
    app.run(port=5003, debug=True)
