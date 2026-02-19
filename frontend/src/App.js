import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [members, setMembers] = useState([]);
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/members")
      .then(res => res.json())
      .then(data => setMembers(data));
  }, []);

  const addMember = () => {
    fetch("http://localhost:5000/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    }).then(() => window.location.reload());
  };

  const addExpense = () => {
    fetch("http://localhost:5000/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paidBy, amount })
    }).then(() => alert("Expense Added"));
  };

  return (
    <div className="container">
      <h2>Expense Split App</h2>

      <h3>Add Member</h3>
      <input
        placeholder="Enter Name"
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={addMember}>Add Member</button>

      <div className="member-list">
        <h4>Members:</h4>
        {members.map((m, i) => (
          <p key={i}>{m}</p>
        ))}
      </div>

      <hr />

      <h3>Add Expense</h3>
      <select onChange={(e) => setPaidBy(e.target.value)}>
        <option>Select Member</option>
        {members.map((m, i) => (
          <option key={i}>{m}</option>
        ))}
      </select>

      <input
        placeholder="Amount"
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={addExpense}>Add Expense</button>
    </div>
  );
}

export default App;
