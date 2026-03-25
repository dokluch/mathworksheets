document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate');
    const percentSlider = document.getElementById('percent');
    const percentVal = document.getElementById('percent-val');

    percentSlider.addEventListener('input', () => {
        percentVal.textContent = `${percentSlider.value}%`;
    });

    generateBtn.addEventListener('click', generateTable);

    function generateTable() {
        const start = parseInt(document.getElementById('start').value);
        const end = parseInt(document.getElementById('end').value);
        const fillDiagonal = document.getElementById('diagonal').checked;
        const randomFillPercent = parseInt(document.getElementById('percent').value);
        const tableContainer = document.getElementById('table-container');

        if (isNaN(start) || isNaN(end) || end <= start) {
            alert('Invalid range. Please ensure "End Number" is greater than "Start Number".');
            return;
        }

        tableContainer.innerHTML = '';
        const table = document.createElement('table');
        
        // Create header row
        const headerRow = table.insertRow();
        const topLeftCell = headerRow.insertCell(); // Top-left empty cell
        topLeftCell.id = 'top-left-cell';
        for (let i = start; i <= end; i++) {
            const th = document.createElement('th');
            th.textContent = i;
            headerRow.appendChild(th);
        }

        const offDiagonalCells = [];

        for (let i = start; i <= end; i++) {
            const row = table.insertRow();
            const th = document.createElement('th');
            th.textContent = i;
            row.appendChild(th);

            for (let j = start; j <= end; j++) {
                const cell = row.insertCell();
                const product = i * j;

                if (fillDiagonal && i === j) {
                    cell.textContent = product;
                    cell.classList.add('filled');
                } else if (i !== j) {
                    offDiagonalCells.push({ cell, product });
                }
            }
        }

        // Randomly fill off-diagonal cells
        if (randomFillPercent > 0) {
            const cellsToFillCount = Math.floor(offDiagonalCells.length * (randomFillPercent / 100));
            shuffleArray(offDiagonalCells);
            for (let i = 0; i < cellsToFillCount; i++) {
                const item = offDiagonalCells[i];
                item.cell.textContent = item.product;
                item.cell.classList.add('filled');
            }
        }

        tableContainer.appendChild(table);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
});
