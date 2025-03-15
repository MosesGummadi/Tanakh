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
        if (row.length > 6) {
            row[5] = row.slice(5).join(","); // Join back the parts after the 6th column
            row = row.slice(0, 6); // Keep only the first 6 columns
        }
        return {
            Parasha: row[0]?.trim(),
            Day: row[1]?.trim(),
            Reference: row[2]?.trim(),
            Hebrew: row[3]?.trim(),
            Translit: row[4]?.trim(),
            // Remove quotes from English text if present
            English: row[5]?.trim().replace(/^"|"$/g, '')
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
    document.getElementById("weekday").textContent = row.Day || "";
    document.getElementById("reference").textContent = row.Reference || "";
    document.getElementById("hebrew").innerHTML = addWordHighlighting(row.Hebrew);
    document.getElementById("translit").textContent = row.Translit || "";
    document.getElementById("english").textContent = row.English || "";
    
    adjustFontSize(); // Add this line to adjust font size after updating content

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
//document.addEventListener("DOMContentLoaded", loadCSV);

document.addEventListener("DOMContentLoaded", function () {
    loadCSV(); // Your existing function to load the CSV

    // Add arrow key navigation
    document.addEventListener("keydown", function (event) {
        if (event.key === "ArrowLeft") {
            prevRow(); // Trigger the "Previous" row function
        } else if (event.key === "ArrowRight") {
            nextRow(); // Trigger the "Next" row function
        }
    });
    
    // Add resize event listener for font size adjustment
    window.addEventListener('resize', adjustFontSize);
    
});

// Function to adjust Hebrew font size if needed

function adjustFontSize() {
    const textbox = document.getElementById('hebrew');
    const maxFontSize = 60;
    let fontSize = maxFontSize;

    textbox.style.fontSize = `${fontSize}px`;

    while (textbox.scrollHeight > textbox.clientHeight && fontSize > 1) {
        fontSize--;
        textbox.style.fontSize = `${fontSize}px`;
    }
}
