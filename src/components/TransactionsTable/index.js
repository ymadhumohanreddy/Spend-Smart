import { Input, Radio, Select, Table } from 'antd';
import React, { useState } from 'react';
// Make sure the path is correct
import searchImg from "../../assets/search.svg"; 
import { parse, unparse } from 'papaparse';
import { toast } from 'react-toastify';

function TransactionsTable({ transactions,addTransaction,fetchTransactions}) {
  const { Option } = Select;
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");

  // Check if the image is loading correctly
  console.log(searchImg);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Tag',
      dataIndex: 'tag',
      key: 'tag',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  // Apply search filter
  let filteredTransactions = transactions.filter((item) => 
  (item.name?.toLowerCase() || '').includes(search.toLowerCase()) &&
  (item.type || '').includes(typeFilter)
);

function exportCSV() {
  // Assuming `transactions` is an array of objects with date fields
  const formattedTransactions = transactions.map((transaction) => ({
    ...transaction,
    // Convert the date to a proper string format (YYYY-MM-DD)
    date: `'${new Date(transaction.date).toISOString().split('T')[0]}'`

  }));

  var csv = unparse({
    fields: ["name", "type", "tag", "date", "amount"],
    data: formattedTransactions,
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "transactions.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


 let sortedTransactions = filteredTransactions.sort((a, b) => {
  if (sortKey === "date") {
    return new Date(a.date) - new Date(b.date);
  } else if (sortKey === "amount") {
    return (parseFloat(a.amount) || 0) - (parseFloat(b.amount) || 0);
  } else {
    return 0;
  }
});

 function importFromCsv(event) {
  event.preventDefault();
  try {
    parse(event.target.files[0], {
      header: true,
      complete: async function (results) {
        for (const transaction of results.data) {
          try {
            // Ensure the amount is a valid float
            const amount = isNaN(parseFloat(transaction.amount)) ? 0 : parseFloat(transaction.amount);

            // Validate and format the date
            const date = transaction.date ? new Date(transaction.date) : null;

            // Check if the date is valid
            const formattedDate = date instanceof Date && !isNaN(date.getTime())
              ? date.toISOString().split('T')[0] // Format to YYYY-MM-DD
              : ''; // Empty string or a default value if the date is invalid

            // Create the new transaction object with valid date and amount
            const newTransaction = {
              ...transaction,
              amount: amount,
              date: formattedDate,
            };

            await addTransaction(newTransaction, true);
          } catch (e) {
            console.error("Error processing transaction:", e);
          }
        }
      },
    });
    toast.success("All Transactions Added");
    fetchTransactions();
    event.target.files = null;
  } catch (e) {
    toast.error("CSV Import Failed: " + e.message);
  }
}

  return (
    <div
      style={{
        width: "97%",
        padding: "0rem 2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div className="input-flex">
          {/* Fallback if image doesn't load */}
          {searchImg ? (
            <img src={searchImg} width="16" alt="Search icon" />
          ) : (
            <span>🔍</span>
          )}
          <input
            placeholder="Search by Name"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          className="select-input"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>
      <div className="my-table">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: "1rem",
          }}
        >
          <h2>My Transactions</h2>

          <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              width: "400px",
            }}
          >
           <button className='btn'onClick={exportCSV}>Export to CSV</button>
           <label for="file-csv" className='btn btn-blue'>Import from CSV</label>
           <input
           id="file-csv"
           type="file"
           accept='.csv'
           required
           onChange={importFromCsv}
           style={{display:"none"}}
           
           />


          </div>
        </div>

        <Table columns={columns} dataSource={sortedTransactions} />
      </div>
    </div>
  );
}

export default TransactionsTable;
