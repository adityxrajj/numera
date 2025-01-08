let currentInput = '0';
let lastOperation = null;
let openBrackets = 0;

document.addEventListener('keydown', handleKeyboardInput);

function appendValue(value) {
    if (currentInput === '0' && value !== '.') {
        currentInput = value;
    } else {
        const lastChar = currentInput.slice(-1);
        const hasDecimalRecently = currentInput.split(/[+\-*/(%]/).pop().includes('.');

        if (value !== '.' || !hasDecimalRecently) {
            currentInput += value;
        }
    }
    updateDisplay();
}

function appendOperator(op) {
    const lastChar = currentInput.slice(-1);
    const operators = ['+', '-', '*', '/', '%'];

    if (operators.includes(lastChar)) {
        currentInput = currentInput.slice(0, -1) + op;
    } else {
        currentInput += ` ${op} `;
    }

    lastOperation = op;
    updateDisplay();
}

function appendBrackets() {
    if (openBrackets > 0 && /[\d)]$/.test(currentInput)) {
        currentInput += ')';
        openBrackets--;
    } else {
        const lastChar = currentInput.slice(-1);
        const implicitMultOperators = [')', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        if (implicitMultOperators.includes(lastChar)) {
            currentInput += ' * (';
        } else {
            currentInput += '(';
        }
        openBrackets++;
    }
    updateDisplay();
}

function calculate() {
    if (openBrackets > 0) {
        alert('Incomplete brackets in the expression');
        return;
    }

    try {
        const sanitizedInput = currentInput.replace(/\s+/g, '');
        if (/[^\d().%+\-*/]/.test(sanitizedInput)) {
            throw new Error('Invalid characters in expression');
        }

        const result = Function(`"use strict"; return (${sanitizedInput})`)();
        currentInput = result.toString();

        lastOperation = null;
        openBrackets = 0;

        updateDisplay();
    } catch (error) {
        console.error('Calculation Error:', error);
        alert('Invalid Expression');
        clearDisplay();
    }
}

function clearLastCharacter() {
    if (currentInput.length <= 1) {
        currentInput = '0';
    } else {
        const lastChar = currentInput.slice(-1);

        if (lastChar === '(') {
            openBrackets = Math.max(0, openBrackets - 1);
        } else if (lastChar === ')') {
            openBrackets++;
        }

        currentInput = currentInput.slice(0, -1).trimEnd();
    }
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    lastOperation = null;
    openBrackets = 0;
    updateDisplay();
}

function updateDisplay() {
    document.getElementById('display').textContent = currentInput || '0';
}

function handleKeyboardInput(event) {
    const key = event.key;

    if (!isNaN(key)) {
        appendValue(key);
    } else if (key === '.') {
        appendValue(key);
    } else if (['+', '-', '*', '/', '%'].includes(key)) {
        appendOperator(key);
    } else if (key === '(' || key === ')') {
        appendBrackets();
    } else if (key === 'Enter' || key === '=') {
        calculate();
        event.preventDefault();
    } else if (key === 'Backspace') {
        clearLastCharacter();
    } else if (key === 'Escape') {
        clearDisplay();
    }
}
