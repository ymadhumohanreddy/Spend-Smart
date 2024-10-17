import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Cards from '../components/Cards';
import { Modal, message, Button as AntButton } from 'antd';
import AddExpenseModal from '../components/Modals/addExpense';
import AddIncomeModal from '../components/Modals/addIncome';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { toast } from 'react-toastify';
import moment from "moment";
import { addDoc, collection, getDocs, query, deleteDoc } from 'firebase/firestore';
import TransactionsTable from '../components/TransactionsTable';
import ChartComponent from '../components/Charts';
import NoTransactions from '../components/NoTransactions';

function Dashboard() {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const resetBalance = async () => {
    try {
      // Delete all transactions from Firestore
      const transactionsRef = collection(db, `users/${user.uid}/transactions`);
      const querySnapshot = await getDocs(transactionsRef);
      
      // Loop through each transaction and delete it
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      // Reset local state
      setIncome(0);
      setExpense(0);
      setTotalBalance(0);
      setTransactions([]); // Clear all transactions in the local state

      message.success('Balance and transactions have been reset!');
    } catch (error) {
      console.error("Error resetting balance: ", error);
      message.error("Couldn't reset transactions.");
    }
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };

  async function addTransaction(transaction, many) {
    try {
      const docRef = await addDoc(collection(db, `users/${user.uid}/transactions`), transaction);
      if (!many) toast.success("Transaction Added!");
      let newArr = [...transactions, transaction];
      setTransactions(newArr);
      calculateBalance();
    } catch (e) {
      console.error("Error adding document: ", e);
      if (!many) toast.error("Couldn't add transaction");
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;
    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });
    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  };

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }

  let sortedTransactions = transactions.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <div>
      <Header />
      {loading ? <p>Loading..</p> : <>
        <Cards
          income={income}
          expense={expense}
          totalBalance={totalBalance}
          showExpenseModal={showExpenseModal}
          showIncomeModal={showIncomeModal}
          resetBalance={resetBalance}
        />
        {transactions.length !== 0 ?
          <ChartComponent sortedTransactions={sortedTransactions} />
          : <NoTransactions />
        }
        <AddExpenseModal
          isExpenseModalVisible={isExpenseModalVisible}
          handleExpenseCancel={handleExpenseCancel}
          onFinish={onFinish}
        />
        <AddIncomeModal
          isIncomeModalVisible={isIncomeModalVisible}
          handleIncomeCancel={handleIncomeCancel}
          onFinish={onFinish}
        />
        <TransactionsTable
          transactions={transactions}
          addTransaction={addTransaction}
          fetchTransactions={fetchTransactions}
        />
        {/* Add the reset button */}
        <AntButton type="danger" onClick={resetBalance} style={{ marginTop: '20px' }}>
          Reset All
        </AntButton>
      </>}
    </div>
  );
}

export default Dashboard;
