const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const FOLDER_PATH = path.join(__dirname, 'data');
const FILE_PATH = path.join(FOLDER_PATH, 'counter.txt');

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

// API to increase the number
app.post('/increase', (req, res) => {
    const currentNumber = readNumber();
    const newNumber = currentNumber + 1;
    writeNumber(newNumber);
    res.json({ message: 'Number increased', number: newNumber });
});

// API to decrease the number
app.post('/decrease', (req, res) => {
    const currentNumber = readNumber();
    const newNumber = currentNumber - 1;
    writeNumber(newNumber);
    res.json({ message: 'Number decreased', number: newNumber });
});

// API to get the current number
app.get('/current', (req, res) => {
    const currentNumber = readNumber();
    res.json({ message: 'Current number', number: currentNumber });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});