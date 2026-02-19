const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const FILE = "data.json";

function readData() {
  const data = fs.readFileSync(FILE);
  return JSON.parse(data);
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
  const { paidBy, amount } = req.body;

  data.expenses.push({ paidBy, amount });
  writeData(data);

  res.json({ message: "Expense added" });
});
app.get("/expenses", (req, res) => {
  const data = readData();
  res.json(data.expenses);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
