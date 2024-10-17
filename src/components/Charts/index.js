import React from 'react';
import { Line, Pie } from '@ant-design/charts';

function ChartComponent({ sortedTransactions }) {
  // Prepare data for Line chart
  const data = sortedTransactions.map((item) => {
    return { date: item.date, amount: item.amount };
  });

  // Filter out expense transactions
  let spendingData = sortedTransactions.filter((transaction) => transaction.type === 'expense');

  // Calculate final spendings based on tags
  let finalSpendings = spendingData.reduce((acc, obj) => {
    let key = obj.tag;
    if (!acc[key]) {
      acc[key] = { tag: obj.tag, amount: obj.amount };
    } else {
      acc[key].amount += obj.amount;
    }
    return acc;
  }, {});

  // Check if there are no expenses
  const totalSpent = Object.values(finalSpendings).reduce((total, obj) => total + obj.amount, 0);
  const pieData = totalSpent === 0 
    ? [] // No pie data if no spending
    : Object.values(finalSpendings);

  // Config for Line chart
  const lineChartConfig = {
    data: data,
    width: 500,
    autoFit: true,
    xField: 'date',
    yField: 'amount',
  };

  // Config for Pie chart
  const pieChartConfig = {
    data: pieData,
    width: 500,
    angleField: 'amount',
    colorField: 'tag',
    label: {
      offset: '-50%', // Adjust the label position
      content: ({ tag }) => (tag === 'No Spending' ? 'No Spending' : tag), // Custom label content
    },
  };

  return (
    <div className="chart-wrapper">
      {/* Line chart container (70% width) */}
      <div className="chart-container line-chart-container">
        <h2>Financial Statistics</h2>
        <Line {...lineChartConfig} />
      </div>

      {/* Pie chart container (30% width) */}
      <div className="chart-container pie-chart-container">
        <h2>Total Spendings</h2>
        {totalSpent === 0 ? (
          <p>It seems like you haven't spent much!</p> // Show this paragraph if no spending
        ) : (
          <Pie {...pieChartConfig} />
        )}
      </div>
    </div>
  );
}

export default ChartComponent;
