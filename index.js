const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const FOLDER_PATH = path.join(__dirname, 'data');
const FILE_PATH = path.join(FOLDER_PATH, 'counter.txt');

// Authorization flag
let isAuthorized = false;

// Ensure the folder and file exist
if (!fs.existsSync(FOLDER_PATH)) {
    fs.mkdirSync(FOLDER_PATH, { recursive: true });
}
if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, '0');
}

// Function to read the current number
const readNumber = () => {
    try {
        const data = fs.readFileSync(FILE_PATH, 'utf8');
        return parseInt(data, 10) || 0;
    } catch (err) {
        console.error('Error reading file:', err);
        return 0;
    }
};

// Function to write the number to the file
const writeNumber = (num) => {
    try {
        fs.writeFileSync(FILE_PATH, num.toString(), 'utf8');
    } catch (err) {
        console.error('Error writing file:', err);
    }
};

// Middleware to check authorization
const checkAuthorization = (req, res, next) => {
    if (!isAuthorized) {
        return res.status(403).json({ message: 'Unauthorized access' });
    }
    next();
};

// API to authorize
app.get('/authorised', (req, res) => {
    isAuthorized = true;
    res.json({ message: 'Authorized successfully' });
});

// API to make unauthorized
app.get('/makeunauthorised', (req, res) => {
    isAuthorized = false;
    res.json({ message: 'Unauthorized successfully' });
});

// API to increase the number
app.get('/increase', checkAuthorization, (req, res) => {
    const currentNumber = readNumber();
    const newNumber = currentNumber + 1;
    writeNumber(newNumber);
    res.json({ message: 'Number increased', number: newNumber });
});

// API to decrease the number
app.get('/decrease', checkAuthorization, (req, res) => {
    const currentNumber = readNumber();
    const newNumber = currentNumber - 1;
    writeNumber(newNumber);
    res.json({ message: 'Number decreased', number: newNumber });
});

// API to get the current number
app.get('/current', checkAuthorization, (req, res) => {
    const currentNumber = readNumber();
    res.json({ message: 'Current number', number: currentNumber });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
