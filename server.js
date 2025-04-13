const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const app = express();
const PORT = process.env.PORT || 3000;
const FILE = "tasks.json";

app.use(express.static("public"));

app.use(express.json());

const loadTasks = () => {
  if (!fs.existsSync(FILE)) return [];
  const data = fs.readFileSync(FILE);
  return JSON.parse(data);
};

const saveTasks = (tasks) => {
  fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
};


app.get("/tasks", (req, res) => {
  const tasks = loadTasks();
  res.json(tasks);
});

app.post("/tasks", (req, res) => {
  const { subject, deadline, description } = req.body;
  const tasks = loadTasks();
  const newTask = {
    id: uuidv4(),
    subject,
    deadline,
    description,
    completed: false
  };
  tasks.push(newTask);
  saveTasks(tasks);
  res.status(201).json(newTask);
});

app.put("/tasks/:id/complete", (req, res) => {
  const { id } = req.params;
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = true;
    saveTasks(tasks);
    res.json(task);
  } else {
    res.status(404).send("Task not found");
  }
});

// Pokretanje servera
app.listen(PORT, () => {
  console.log(`Server radi na http://localhost:${PORT}`);
});
