import React from 'react';
import "./styles.css";
import { Card, Row } from 'antd';
import Button from '../Button';

function Cards({ income, expense, totalBalance, showExpenseModal, showIncomeModal, resetBalance }) {
  return (
    <div>
      <Row className='myrow'>
        <Card bordered={true} className="mycard">
          <h2>Current Balance</h2>
          <p>₹{totalBalance}</p>
          <Button 
            text="Reset Balance" 
            blue={true} 
            onClick={resetBalance} 
            disabled={totalBalance === 0} // Disable if balance is zero
          />
        </Card>
        
        <Card bordered={true} className="mycard">
          <h2>Total Income</h2>
          <p>₹{income}</p>
          <Button text="Add Income" blue={true} onClick={showIncomeModal} />
        </Card>
        
        <Card bordered={true} className="mycard">
          <h2>Total Expense</h2>
          <p>₹{expense}</p>
          <Button text="Add Expense" blue={true} onClick={showExpenseModal} />
        </Card>
      </Row>
    </div>
  );
}

export default Cards;
