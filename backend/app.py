from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

EXCEL_FILE = "portfolio.xlsx"

# Create Excel file if not exists
if not os.path.exists(EXCEL_FILE):
    df = pd.DataFrame(columns=[
        "Investment Name",
        "Sector",
        "Investment Type",
        "Buy Price"
    ])
    df.to_excel(EXCEL_FILE, index=False)


# ==========================================
# ADD INVESTMENT
# ==========================================

@app.route('/add-investment', methods=['POST'])
def add_investment():

    data = request.json

    investment_name = data['investment_name']
    sector = data['sector']
    investment_type = data['investment_type']
    buy_price = float(data['buy_price'])

    df = pd.read_excel(EXCEL_FILE)

    new_row = {
        "Investment Name": investment_name,
        "Sector": sector,
        "Investment Type": investment_type,
        "Buy Price": buy_price
    }

    df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)

    df.to_excel(EXCEL_FILE, index=False)

    return jsonify({
        "message": "Investment Added Successfully"
    })


# ==========================================
# GET PORTFOLIO DATA
# ==========================================

@app.route('/portfolio', methods=['GET'])
def get_portfolio():

    df = pd.read_excel(EXCEL_FILE)

    total_portfolio_value = df['Buy Price'].sum()

    # ==========================================
    # INVESTMENT TYPE ALLOCATION
    # ==========================================

    investment_group = (
        df.groupby('Investment Type')['Buy Price']
        .sum()
        .reset_index()
    )

    investment_data = []

    for _, row in investment_group.iterrows():

        allocation = (
            row['Buy Price'] / total_portfolio_value
        ) * 100

        investment_data.append({
            "name": row['Investment Type'],
            "value": row['Buy Price'],
            "percentage": round(allocation, 2)
        })


    # ==========================================
    # SECTOR ALLOCATION
    # ==========================================

    sector_group = (
        df.groupby('Sector')['Buy Price']
        .sum()
        .reset_index()
    )

    sector_data = []

    for _, row in sector_group.iterrows():

        allocation = (
            row['Buy Price'] / total_portfolio_value
        ) * 100

        sector_data.append({
            "name": row['Sector'],
            "value": row['Buy Price'],
            "percentage": round(allocation, 2)
        })


    return jsonify({
        "total_portfolio_value": total_portfolio_value,
        "investment_allocation": investment_data,
        "sector_allocation": sector_data,
        "table_data": df.to_dict(orient='records')
    })


if __name__ == '__main__':
    app.run(debug=True)