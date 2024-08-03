const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;
const expensesFile = './expenses.json';
const incomesFile = './incomes.json';
const usersFile = './users.json';
const todoFile = './todo.json'; // JSON file to store todos

app.use(cors());
app.use(bodyParser.json());

// Middleware to handle file read/write errors
function handleFileError(err, res, operation) {
  console.error(`Error ${operation} file:`, err);
  res.status(500).send(`Error ${operation} data`);
}

// Authenticate user
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  fs.readFile(usersFile, (err, data) => {
    if (err) {
      return handleFileError(err, res, 'reading');
    }
    const users = JSON.parse(data);
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      res.json({ message: 'Login successful', user });
    } else {
      res.status(401).send('Invalid email or password');
    }
  });
});

// Register new user
app.post('/register', (req, res) => {
  const newUser = req.body;
  fs.readFile(usersFile, (err, data) => {
    if (err) {
      return handleFileError(err, res, 'reading');
    }
    const users = JSON.parse(data);
    const existingUser = users.find(u => u.email === newUser.email);
    if (existingUser) {
      res.status(409).send('User with this email already exists');
    } else {
      users.push(newUser);
      fs.writeFile(usersFile, JSON.stringify(users, null, 2), (err) => {
        if (err) {
          return handleFileError(err, res, 'saving');
        }
        res.json({ message: 'Registration successful', user: newUser });
      });
    }
  });
});

// Fetch all expenses
app.get('/expenses', (req, res) => {
  fs.readFile(expensesFile, (err, data) => {
    if (err) {
      return handleFileError(err, res, 'reading');
    }
    const expenses = JSON.parse(data);
    res.json(expenses);
  });
});

// Save expenses
app.post('/expenses', (req, res) => {
  const newExpenses = req.body.expenses;
  fs.writeFile(expensesFile, JSON.stringify(newExpenses, null, 2), (err) => {
    if (err) {
      return handleFileError(err, res, 'saving');
    }
    res.send('Expenses saved successfully');
  });
});

// Fetch all incomes
app.get('/incomes', (req, res) => {
  fs.readFile(incomesFile, (err, data) => {
    if (err) {
      return handleFileError(err, res, 'reading');
    }
    const incomes = JSON.parse(data);
    res.json(incomes);
  });
});

// Save incomes
app.post('/incomes', (req, res) => {
  const newIncomes = req.body.incomes;
  fs.writeFile(incomesFile, JSON.stringify(newIncomes, null, 2), (err) => {
    if (err) {
      return handleFileError(err, res, 'saving');
    }
    res.send('Incomes saved successfully');
  });
});

// Fetch todos
app.get('/todos', (req, res) => {
  fs.readFile(todoFile, (err, data) => {
    if (err) {
      return handleFileError(err, res, 'reading');
    }
    const todos = JSON.parse(data);
    res.json(todos);
  });
});

// Save todos
app.post('/todos', (req, res) => {
  const newTodo = req.body;
  fs.readFile(todoFile, (err, data) => {
    if (err) {
      return handleFileError(err, res, 'reading');
    }
    const todos = JSON.parse(data);
    todos.push(newTodo);
    fs.writeFile(todoFile, JSON.stringify(todos, null, 2), (err) => {
      if (err) {
        return handleFileError(err, res, 'saving');
      }
      res.send('Todo saved successfully');
    });
  });
});

// Delete todo
app.delete('/todos/:id', (req, res) => {
  const todoId = req.params.id;
  fs.readFile(todoFile, (err, data) => {
    if (err) {
      return handleFileError(err, res, 'reading');
    }
    let todos = JSON.parse(data);
    todos = todos.filter(todo => todo.id !== todoId);
    fs.writeFile(todoFile, JSON.stringify(todos, null, 2), (err) => {
      if (err) {
        return handleFileError(err, res, 'saving');
      }
      res.send('Todo deleted successfully');
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
