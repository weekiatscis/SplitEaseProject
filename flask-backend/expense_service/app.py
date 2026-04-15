import os
from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

app = Flask(__name__)
CORS(app)

BASE_URL = os.getenv("NEXT_PUBLIC_EXPENSE_API_BASE_URL")
EXPENSE_SUMMARY_URL = os.getenv("NEXT_PUBLIC_EXPENSE_SUMMARY_API_BASE_URL")
EVEN_SPLIT_URL = os.getenv("NEXT_PUBLIC_EVEN_SPLIT_API_BASE_URL")
UNEVEN_SPLIT_URL = os.getenv("NEXT_PUBLIC_UNEVEN_SPLIT_API_BASE_URL")
EXPENSES_SPLIT_URL = os.getenv("NEXT_PUBLIC_EXPENSES_SPLIT_API_BASE_URL")


def forward(base_url, path, method, params=None, json=None):
    url = f"{base_url.rstrip('/')}/{path}"
    resp = requests.request(method, url, params=params, json=json)
    try:
        return jsonify(resp.json()), resp.status_code
    except Exception:
        return resp.text, resp.status_code


@app.route("/expenses/CreateExpenseEvenSplit", methods=["POST"])
def create_expense():
    return forward(BASE_URL, "expenses/CreateExpenseEvenSplit", "POST", json=request.get_json())


@app.route("/expenses/CreateExpenseEvenSplit3", methods=["POST"])
def create_expense_even_split3():
    return forward(EVEN_SPLIT_URL, "expenses/CreateExpenseEvenSplit3", "POST", json=request.get_json())


@app.route("/expenses/UnevenSplitByDollar", methods=["POST"])
def create_expense_uneven_dollar():
    return forward(UNEVEN_SPLIT_URL, "ExpenseUnevenSplittingByDollar", "POST", json=request.get_json())


@app.route("/expenses/UnevenSplitByPercentage", methods=["POST"])
def create_expense_uneven_percentage():
    return forward(UNEVEN_SPLIT_URL, "ExpenseUnevenSplittingByPercentage", "POST", json=request.get_json())


@app.route("/GetGroupSummary", methods=["GET"])
def get_group_summary():
    return forward(BASE_URL, "GetGroupSummary", "GET", params=request.args)


@app.route("/GetGroupExpenseSummary2", methods=["GET"])
def get_group_expense_summary2():
    return forward(EXPENSE_SUMMARY_URL, "GetGroupExpenseSummary2", "GET", params=request.args)


@app.route("/DeleteExpense", methods=["DELETE"])
def delete_expense():
    return forward(BASE_URL, "DeleteExpense", "DELETE", params=request.args)


@app.route("/GetExpensesSplit", methods=["GET"])
def get_expenses_split():
    return forward(EXPENSES_SPLIT_URL, "GetExpensesSplit", "GET", params=request.args)


@app.route("/GetExpensesSplitSummary", methods=["GET"])
def get_expenses_split_summary():
    return forward(EXPENSES_SPLIT_URL, "GetExpensesSplitSummary", "GET", params=request.args)


if __name__ == "__main__":
    app.run(port=5003, debug=True, use_reloader=False)
