document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const socket = io();
    const colorPicker = document.getElementById('color');
    const clearButton = document.getElementById('clearButton');

    createGrid();

    clearButton.addEventListener('click', () => {
        socket.emit('clearGrid');
    });

    colorPicker.addEventListener('input', () => {
        socket.emit('updateColor', colorPicker.value);
    });

    function createGrid() {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.addEventListener('mousedown', (event) => handleCellClick(event, i, j));
                cell.addEventListener('contextmenu', (event) => handleCellRightClick(event, i, j));
                grid.appendChild(cell);
            }
        }
    }

    function handleCellClick(event, row, col) {
        event.preventDefault();
        paintCell(event.target, colorPicker.value);
        socket.emit('paintCell', { row, col, color: colorPicker.value });
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', handleCellHover);
        });
    }

    function handleCellHover(event) {
        paintCell(event.target, colorPicker.value);
    }

    function handleCellRightClick(event, row, col) {
        event.preventDefault();
        paintCell(event.target, colorPicker.value);
        socket.emit('paintCell', { row, col, color: colorPicker.value });
    }

    function paintCell(cell, color) {
        cell.style.backgroundColor = color;
    }

    socket.on('updateCell', ({ row, col, color }) => {
        const cells = document.getElementsByClassName('cell');
        const index = row * 10 + col;
        paintCell(cells[index], color);
    });

    socket.on('clearGrid', () => {
        clearGrid();
    });

    function clearGrid() {
        const cells = document.getElementsByClassName('cell');
        Array.from(cells).forEach((cell) => {
            cell.style.backgroundColor = 'white';
        });
    }
});
