# Technical Specification: Printable Multiplication Table Generator Web App

## 1. Overview

This document outlines the technical specifications for a simple web-based application that generates a customizable multiplication table. The app allows users to specify a range of numbers (e.g., from 1 to 11), optionally pre-fill the main diagonal (e.g., 2x2, 3x3), and randomly pre-fill a user-controlled percentage of other cells. The output is a printable HTML table optimized for browser printing, with pre-filled cells displaying centered, bold, colored numbers (e.g., black bold text on a white background for clarity). The app is designed to be minimalistic, using vanilla HTML, CSS, and JavaScript, with no external dependencies or frameworks, ensuring it runs entirely in the browser.

### Purpose

- Generate multiplication tables for educational use, particularly for children to practice by filling in blanks.
- Provide controls for customization to focus on specific learning needs (e.g., diagonals for squares, random fills for partial practice).
- Ensure the output is printer-friendly, with clean layout and no unnecessary UI elements on print.

### Scope

- Single-page web app.
- No server-side components; all logic client-side.
- Compatible with modern browsers (Chrome, Firefox, Edge, Safari).
- Responsive for desktop and mobile, but optimized for printing on A4/Letter paper.

## 2. Functional Requirements

### 2.1 User Inputs

- **Start Number**: Integer input field (default: 1, min: 1, max: 20) for the starting row/column number.
- **End Number**: Integer input field (default: 10, min: start+1, max: 50) for the ending row/column number. Validation: Ensure end > start.
- **Main Diagonal Checkbox**: Boolean checkbox (default: unchecked). If checked, pre-fill the diagonal cells (i x i) with their products (e.g., 2x2=4).
- **Random Fill Slider**: Slider control for percentage (0-100%, default: 0%, step: 5%) of off-diagonal cells to pre-fill randomly with correct products. Excludes diagonal if checkbox is checked.
- **Generate Button**: Triggers table generation based on inputs.

### 2.2 Table Generation Logic

- Create a square table: Rows and columns from start to end (e.g., 1-11 creates an 11x11 grid, excluding headers).
- **Headers**: Top row and left column show numbers (start to end) in bold, centered.
- **Cell Content**:
  - Diagonal (if checkbox checked): Pre-fill i x i = product (e.g., cell [2,2] = 4).
  - Random fills: Calculate total off-diagonal cells (total cells - diagonal cells). Select random subset based on percentage (e.g., 10% of off-diagonals). Fill with correct i x j product.
  - All pre-filled cells: Display product in bold, centered, colored font (e.g., CSS: font-weight: bold; color: #000; text-align: center;).
  - Blank cells: Empty (white background, bordered for writing).
- **Randomization**: Use JavaScript Math.random() for selecting cells. Ensure no duplicates in random selection.
- **Edge Cases**:
  - If start=1, end=1: 1x1 table.
  - If percentage=100%: All off-diagonal cells filled (full table minus diagonal if checked).
  - If percentage=0% and diagonal unchecked: Empty table (just headers and borders).
  - Validate inputs: Alert on invalid (e.g., non-integer, end <= start).

### 2.3 Output and Printing

- Display generated table below inputs.
- Table styled as a grid with borders (e.g., 1px solid black) for each cell, fixed width/height (e.g., 50px per cell) for uniformity.
- Printable view: Use CSS @media print to hide input controls and show only the table, centered on page with margins (e.g., 1cm).
- Button to trigger browser print (window.print()).

### 2.4 Non-Functional Requirements

- **Performance**: Instant generation for ranges up to 50x50 (negligible computation).
- **Accessibility**: Use semantic HTML (e.g., <table>, <th>, <td>). ARIA labels for inputs.
- **Security**: No data storage or external calls; pure client-side.
- **Usability**: Simple UI with labels. Tooltips for controls (e.g., "Fill % of cells randomly").
- **Error Handling**: JavaScript alerts for invalid inputs.

## 3. User Interface Description

- **Layout**: Vertical stack.
  - Header: "Multiplication Table Generator".
  - Form:
    - Label + Input: "Start Number" (number input).
    - Label + Input: "End Number" (number input).
    - Label + Checkbox: "Fill Main Diagonal".
    - Label + Slider: "Random Fill Percentage" (with display of current %).
    - Button: "Generate Table".
  - Output Section: Generated <table> element.
  - Print Button: "Print Table" (appears after generation).
- **Styling**:
  - CSS: Basic sans-serif font (e.g., Arial). Table cells: min-width: 50px; height: 50px; border: 1px solid #000; text-align: center; vertical-align: middle.
  - Pre-filled: font-weight: bold; font-size: 16px; color: #333.
  - @media print { body > \*:not(#table-container) { display: none; } #table-container { margin: 1cm auto; } }
- **Interactivity**: JavaScript event listeners for button click to generate table dynamically.

## 4. Technical Details

### 4.1 Technologies

- **HTML5**: Structure (form, table).
- **CSS3**: Styling and print media queries.
- **JavaScript (ES6)**: Logic for generation, randomization, validation.

### 4.2 Key Code Snippets (High-Level Pseudocode)

- **HTML Skeleton**:

  ```html
  <form id="controls">
    <label>Start: <input type="number" id="start" value="1" /></label>
    <label>End: <input type="number" id="end" value="10" /></label>
    <label>Diagonal: <input type="checkbox" id="diagonal" /></label>
    <label
      >Random %: <input type="range" id="percent" min="0" max="100" value="0"
    /></label>
    <span id="percent-val">0%</span>
    <button type="button" id="generate">Generate</button>
  </form>
  <div id="table-container"></div>
  <button id="print" style="display:none;">Print</button>
  ```

- **JavaScript Logic**:

  ```javascript
  document.getElementById("generate").addEventListener("click", () => {
    let start = parseInt(document.getElementById("start").value);
    let end = parseInt(document.getElementById("end").value);
    let diagonal = document.getElementById("diagonal").checked;
    let percent = parseInt(document.getElementById("percent").value);

    if (isNaN(start) || isNaN(end) || end <= start) {
      alert("Invalid range");
      return;
    }

    let table = document.createElement("table");
    // Add header row...
    for (let i = start - 1; i <= end; i++) {
      let row = table.insertRow();
      for (let j = start - 1; j <= end; j++) {
        let cell = row.insertCell();
        if (i === 0 || j === 0) {
          // Headers
          cell.textContent = i === 0 ? j : i;
          cell.style.fontWeight = "bold";
        } else {
          let product = i * j;
          if (diagonal && i === j) {
            cell.textContent = product;
          } else if (!diagonal || i !== j) {
            // Random logic: collect off-diagonals, shuffle, fill top N%
          }
        }
      }
    }
    document.getElementById("table-container").innerHTML = "";
    document.getElementById("table-container").appendChild(table);
    document.getElementById("print").style.display = "block";
  });

  document
    .getElementById("print")
    .addEventListener("click", () => window.print());
  // Additional: Update percent-val on slider change
  ```

- **Random Fill Implementation**:
  Collect array of off-diagonal positions, shuffle, slice top (percent/100 \* length), fill those cells.

### 4.3 Testing Considerations

- Unit Tests: Validate range, diagonal fill, random % (mock Math.random).
- Manual: Generate tables, print preview in browser, check centering/borders.
- Cross-Browser: Test print layout.

### 4.4 Deployment

- Host as static HTML file (e.g., GitHub Pages).
- No build tools needed.

This specification provides a complete blueprint for development. If needed, I can assist with implementing the code or refining details.
