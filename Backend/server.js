const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const FILE = "data.json";

function readData() {
  return JSON.parse(fs.readFileSync(FILE));
}
function writeData(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

app.post("/members", (req, res) => {
  const data = readData();
  const { name } = req.body;

  if (data.members.includes(name)) {
    return res.json({ message: "Member already exists" });
  }

  data.members.push(name);
  writeData(data);

  res.json({ message: "Member added" });
});
app.get("/members", (req, res) => {
  const data = readData();
  res.json(data.members);
});

app.post("/expenses", (req, res) => {
  const data = readData();
  const { paidBy, amount, description } = req.body;

  const members = data.members;
  const splitAmount = amount / members.length;

  data.expenses.push({ paidBy, amount, description });

  members.forEach(member => {
    if (member !== paidBy) {
      data.transactions.push({
        from: member,
        to: paidBy,
        amount: splitAmount
      });
    }
  });

  writeData(data);

  res.json({ message: "Expense added & split equally" });
});

app.get("/expenses", (req, res) => {
  const data = readData();
  res.json(data.expenses);
});


app.get("/transactions", (req, res) => {
  const data = readData();
  res.json(data.transactions);
});


app.get("/debts", (req, res) => {
  const data = readData();
  const transactions = data.transactions;

  let debts = {};

  transactions.forEach(t => {
    const key1 = `${t.from}-${t.to}`;
    const key2 = `${t.to}-${t.from}`;

    if (debts[key2]) {
      debts[key2] -= t.amount;
    } else {
      debts[key1] = (debts[key1] || 0) + t.amount;
    }
  });

  let result = [];

  for (let key in debts) {
    if (debts[key] > 0) {
      const [from, to] = key.split("-");
      result.push({ from, to, amount: debts[key] });
    }
  }

  res.json(result);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});