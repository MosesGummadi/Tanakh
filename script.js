let currentRow = 0;
let data;
const highlightColor = '#88FA4E';

function fetchCSV() {
    return fetch('data.csv')
        .then(response => response.text())
        .then(text => {
            // Skip the first row as it contains the headers
            const rows = text.split('\n').slice(1);
            data = rows.map(row => {
                let columns = row.split(',');
                // Check if column length exceeds 3, which means commas in the last column are being split
                if (columns.length > 3) {
                    // Join all columns after the first two into the last column
                    columns[2] = columns.slice(2).join(',');
                    columns = columns.slice(0, 3); // keep only the first three columns
                }
                return columns;
            });
            if (data.length > 0) {
                displayRow(currentRow);
            }
        });
}

function displayRow(index) {
    if (data && index >= 0 && index < data.length) {
        document.getElementById('hebrew').innerHTML = addWordHighlighting(data[index][0]);
        document.getElementById('translit').textContent = data[index][1];
        document.getElementById('english').textContent = data[index][2];
        setupWordHighlighting();
    }
}

function addWordHighlighting(text) {
    const words = text.split(' ');
    return words.map(word => {
        return `<span style="display: inline-block; margin-right: 0.5em; line-height: 1; word-break: keep-all;">${word}</span>`;
    }).join('');
}

function setupWordHighlighting() {
    const words = document.querySelectorAll('#hebrew span');
    words.forEach(word => {
        word.addEventListener('mouseover', function(e) {
            e.target.style.backgroundColor = highlightColor;
        });
        word.addEventListener('mouseout', function(e) {
            e.target.style.backgroundColor = 'transparent';
        });
    });
}

function nextRow() {
    if (currentRow < data.length - 1) {
        currentRow++;
        displayRow(currentRow);
    }
}

function prevRow() {
    if (currentRow > 0) {
        currentRow--;
        displayRow(currentRow);
    }
}

// Load CSV data when the page loads
window.onload = fetchCSV;