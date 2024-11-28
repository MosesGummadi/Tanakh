let currentRow = 0;
let data = [];

/**
 * Load and parse the CSV file directly from the server (same folder as index.html).
 */
function loadCSV() {
    fetch('data.csv')
        .then(response => response.text())
        .then(content => {
            parseCSV(content);
        })
        .catch(error => {
            console.error('Error loading CSV:', error);
        });
}

/**
 * Parses CSV content and stores it in the `data` array.
 * Skips the first row (header) and ensures the English text is not split.
 */
function parseCSV(content) {
    const rows = content.split("\n").map(row => row.split(","));
    rows.shift(); // Skip the first row (header)

    data = rows.map(row => {
        if (row.length > 5) {
            row[4] = row.slice(4).join(","); // Join back the parts after the 5th column
            row = row.slice(0, 5); // Keep only the first 5 columns
        }
        return {
            Parasha: row[0]?.trim(),
            Reference: row[1]?.trim(),
            Hebrew: row[2]?.trim(),
            Translit: row[3]?.trim(),
            English: row[4]?.trim()
        };
    });

    currentRow = 0; // Reset to the first row
    updateDisplay();
}


/**
 * Adds highlighting to Hebrew words.
 * Each word is wrapped in a <span> with a margin to create spacing.
 */
function addWordHighlighting(text) {
    text = text.trim();
    const words = text.split(/\s+/);
    let html = '<div>';
    for(let word of words) {
        html += `<span class="highlightable">${word}</span> `; // Notice the space after span
    }
    html += '</div>';
    return html;
}

function updateDisplay() {
    if (data.length === 0) return; // No data to display
    const row = data[currentRow];
    document.getElementById("parasha").textContent = row.Parasha || "";
    document.getElementById("reference").textContent = row.Reference || "";
    document.getElementById("hebrew").innerHTML = addWordHighlighting(row.Hebrew);
    document.getElementById("translit").textContent = row.Translit || "";
    document.getElementById("english").textContent = row.English || "";

    setupWordHighlighting();
}

/**
 * Setup word highlighting for the Hebrew text.
 * Highlights words when the mouse hovers over them.
 */
function setupWordHighlighting() {
    const words = document.querySelectorAll('#hebrew span');
    words.forEach(word => {
        word.addEventListener('mouseover', function(e) {
            e.target.style.backgroundColor = '#88FA4E'; // Highlight color on hover
        });
        word.addEventListener('mouseout', function(e) {
            e.target.style.backgroundColor = 'transparent'; // Reset color when mouse leaves
        });
    });
}

/**
 * Navigates to the previous row.
 */
function prevRow() {
    if (data.length === 0) return;
    currentRow = (currentRow - 1 + data.length) % data.length;
    updateDisplay();
}

/**
 * Navigates to the next row.
 */
function nextRow() {
    if (data.length === 0) return;
    currentRow = (currentRow + 1) % data.length;
    updateDisplay();
}

// Load the CSV data when the page loads
document.addEventListener("DOMContentLoaded", loadCSV);