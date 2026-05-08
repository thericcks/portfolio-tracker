import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#AA336A',
  '#33AA55',
  '#7755CC'
];

function App() {

  const [formData, setFormData] = useState({
    investment_name: '',
    sector: 'Technology',
    investment_type: 'Stock',
    buy_price: ''
  });

  const [portfolioData, setPortfolioData] = useState(null);


  // ==========================================
  // LOAD DATA
  // ==========================================

  const fetchPortfolio = async () => {
    const response = await axios.get('http://127.0.0.1:5000/portfolio');
    setPortfolioData(response.data);
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);


  // ==========================================
  // HANDLE FORM INPUT
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  // ==========================================
  // SUBMIT FORM
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(
      'http://127.0.0.1:5000/add-investment',
      formData
    );

    fetchPortfolio();

    setFormData({
      investment_name: '',
      sector: 'Technology',
      investment_type: 'Stock',
      buy_price: ''
    });
  };


  // ==========================================
  // CUSTOM LABELS
  // ==========================================

  const renderCustomLabel = ({
    name,
    value,
    percentage
  }) => {
    return `${name} | ₹${value} | ${percentage}%`;
  };


  return (
    <div style={{ padding: '20px' }}>

      <h1>Portfolio Tracker</h1>

      <h2>
        Total Portfolio Value:
        ₹{portfolioData?.total_portfolio_value || 0}
      </h2>


      {/* ====================================== */}
      {/* FORM */}
      {/* ====================================== */}

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="investment_name"
          placeholder="Investment Name"
          value={formData.investment_name}
          onChange={handleChange}
          required
        />


        <select
          name="sector"
          value={formData.sector}
          onChange={handleChange}
        >
          <option>Technology</option>
          <option>Finance</option>
          <option>Healthcare</option>
          <option>Energy</option>
          <option>Consumer</option>
          <option>Industrial</option>
          <option>Utilities</option>
          <option>Real Estate</option>
          <option>Telecom</option>
          <option>Automobile</option>
          <option>Materials</option>
        </select>


        <select
          name="investment_type"
          value={formData.investment_type}
          onChange={handleChange}
        >
          <option>Stock</option>
          <option>ETF</option>
          <option>Mutual Fund</option>
          <option>Bond</option>
          <option>Crypto</option>
          <option>Gold</option>
          <option>Real Estate</option>
          <option>Commodity</option>
          <option>Index Fund</option>
          <option>REIT</option>
          <option>Cash</option>
        </select>


        <input
          type="number"
          name="buy_price"
          placeholder="Buy Price"
          value={formData.buy_price}
          onChange={handleChange}
          required
        />


        <button type="submit">
          Add Investment
        </button>

      </form>


      {/* ====================================== */}
      {/* INVESTMENT TYPE PIE CHART */}
      {/* ====================================== */}

      <h2>Investment Allocation</h2>

      <ResponsiveContainer width="100%" height={400}>

        <PieChart>

          <Pie
            data={portfolioData?.investment_allocation || []}
            dataKey="value"
            nameKey="name"
            outerRadius={150}
            label={({ name, value, percentage }) =>
              renderCustomLabel({
                name,
                value,
                percentage
              })
            }
          >

            {(portfolioData?.investment_allocation || []).map(
              (entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              )
            )}

          </Pie>

          <Tooltip />
          <Legend />

        </PieChart>

      </ResponsiveContainer>


      {/* ====================================== */}
      {/* SECTOR PIE CHART */}
      {/* ====================================== */}

      <h2>Sector Allocation</h2>

      <ResponsiveContainer width="100%" height={400}>

        <PieChart>

          <Pie
            data={portfolioData?.sector_allocation || []}
            dataKey="value"
            nameKey="name"
            outerRadius={150}
            label={({ name, value, percentage }) =>
              renderCustomLabel({
                name,
                value,
                percentage
              })
            }
          >

            {(portfolioData?.sector_allocation || []).map(
              (entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              )
            )}

          </Pie>

          <Tooltip />
          <Legend />

        </PieChart>

      </ResponsiveContainer>


      {/* ====================================== */}
      {/* TABLE */}
      {/* ====================================== */}

      <h2>Investments</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Sector</th>
            <th>Type</th>
            <th>Buy Price</th>
          </tr>
        </thead>

        <tbody>

          {(portfolioData?.table_data || []).map((row, index) => (
            <tr key={index}>
              <td>{row['Investment Name']}</td>
              <td>{row['Sector']}</td>
              <td>{row['Investment Type']}</td>
              <td>₹{row['Buy Price']}</td>
            </tr>
          ))}

        </tbody>
      </table>

    </div>
  );
}

export default App;