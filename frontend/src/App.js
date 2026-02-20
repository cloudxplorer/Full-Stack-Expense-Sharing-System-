import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [members, setMembers] = useState([]);
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [description, setDescription] = useState("");
  const [debts, setDebts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");

  useEffect(() => {
    fetchMembers();
    fetchDebts();
    fetchTransactions();
  }, []);

  const fetchMembers = () => {
    fetch("http://localhost:5000/members")
      .then(res => res.json())
      .then(data => setMembers(data));
  };

  const fetchDebts = () => {
    fetch("http://localhost:5000/debts")
      .then(res => res.json())
      .then(data => setDebts(data));
  };

  const fetchTransactions = () => {
    fetch("http://localhost:5000/transactions")
      .then(res => res.json())
      .then(data => setTransactions(data));
  };

  const addMember = () => {
    if (!name) return;

    fetch("http://localhost:5000/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    }).then(() => {
      setName("");
      fetchMembers();
    });
  };

  const addExpense = () => {
    if (!paidBy || !amount) return;

    fetch("http://localhost:5000/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paidBy,
        amount: Number(amount),
        description
      })
    }).then(() => {
      setAmount("");
      setDescription("");
      fetchDebts();
      fetchTransactions();
    });
  };

  const filteredDebts = selectedMember
    ? debts.filter(
        d => d.from === selectedMember || d.to === selectedMember
      )
    : debts;

  return (
    <div className="container">
      <h2>Expense Split App</h2>

      {/* Add Member */}
      <h3>Add Member</h3>
      <input
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={addMember}>Add Member</button>

      <div className="member-list">
        <h4>Members:</h4>
        {members.length === 0 && (
          <p className="empty-text">No members added</p>
        )}
        {members.map((m, i) => (
          <p key={i}>{m}</p>
        ))}
      </div>

      <hr />

      {/* Add Expense */}
      <h3>Add Expense</h3>

      <select onChange={(e) => setPaidBy(e.target.value)}>
        <option value="">Select Member</option>
        {members.map((m, i) => (
          <option key={i}>{m}</option>
        ))}
      </select>

      <input
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={addExpense}>Add Expense</button>

      <hr />

      {/* Filter */}
      <h3>Filter by Member</h3>
      <select onChange={(e) => setSelectedMember(e.target.value)}>
        <option value="">All Members</option>
        {members.map((m, i) => (
          <option key={i}>{m}</option>
        ))}
      </select>

      <hr />

      {/* Debts */}
      <h3>Debts</h3>

      {filteredDebts.length === 0 && (
        <p className="empty-text">No debts yet</p>
      )}

      {filteredDebts.map((d, i) => {
        const isOwe = selectedMember === d.from;

        return (
          <div
            key={i}
            className={`debt-item ${
              selectedMember
                ? isOwe
                  ? "debt-owe"
                  : "debt-receive"
                : "debt-owe"
            }`}
          >
            {d.from} owes {d.to} ₹{d.amount}
          </div>
        );
      })}

      <hr />

      {/* Transactions */}
      <h3>Transaction History</h3>

      {transactions.length === 0 && (
        <p className="empty-text">No transactions yet</p>
      )}

      {transactions.map((t, i) => (
        <div key={i} className="transaction-item">
          {t.from} → {t.to} ₹{t.amount}
        </div>
      ))}
    </div>
  );
}

export default App;