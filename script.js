let articleNumber = 4;


// -------------------------------------
// CREATE TABLE
// -------------------------------------

function createTable() {

    const count =
        parseInt(
            document.getElementById("articleCount").value
        );

    if (count < 1 || count > 50) {

        showError("Please choose between 1 and 50 articles.");

        return;
    }

    articleNumber = count;

    const body =
        document.getElementById("inputBody");

    body.innerHTML = "";

    for (let i = 1; i <= count; i++) {

        addArticleRow(i);

    }

    hideResults();

    clearError();
}


// -------------------------------------
// ADD ARTICLE
// -------------------------------------

function addArticleRow(number) {

    const body =
        document.getElementById("inputBody");

    const row =
        document.createElement("tr");

    row.innerHTML = `

        <td>
            <strong>Article ${number}</strong>
        </td>

        <td>
            <input
                type="number"
                step="any"
                class="p0"
                placeholder="P₀"
            >
        </td>

        <td>
            <input
                type="number"
                step="any"
                class="p1"
                placeholder="P₁"
            >
        </td>

        <td>
            <input
                type="number"
                step="any"
                class="q0"
                placeholder="Q₀"
            >
        </td>

        <td>
            <input
                type="number"
                step="any"
                class="q1"
                placeholder="Q₁"
            >
        </td>

        <td>

            <button
                class="danger remove-btn"
                onclick="removeArticle(this)"
            >
                Remove
            </button>

        </td>

    `;

    body.appendChild(row);
}


// -------------------------------------
// REMOVE ARTICLE
// -------------------------------------

function removeArticle(button) {

    const row =
        button.closest("tr");

    row.remove();

    renumberArticles();
}


// -------------------------------------
// RENUMBER ARTICLES
// -------------------------------------

function renumberArticles() {

    const rows =
        document.querySelectorAll("#inputBody tr");

    rows.forEach((row, index) => {

        row.querySelector("strong").textContent =
            `Article ${index + 1}`;

    });

    document.getElementById("articleCount").value =
        rows.length;

    articleNumber = rows.length;

}


// -------------------------------------
// CALCULATE
// -------------------------------------

function calculate() {

    const rows =
        document.querySelectorAll("#inputBody tr");

    if (rows.length === 0) {

        showError("Please add at least one article.");

        return;
    }


    let totalP0Q0 = 0;
    let totalP1Q0 = 0;
    let totalP0Q1 = 0;
    let totalP1Q1 = 0;

    let totalP1Both = 0;
    let totalP0Both = 0;


    const calculationBody =
        document.getElementById("calculationBody");

    calculationBody.innerHTML = "";


    let steps = "";


    // ---------------------------------
    // PROCESS EACH ARTICLE
    // ---------------------------------

    for (let i = 0; i < rows.length; i++) {

        const row = rows[i];


        const p0 =
            parseFloat(
                row.querySelector(".p0").value
            );

        const p1 =
            parseFloat(
                row.querySelector(".p1").value
            );

        const q0 =
            parseFloat(
                row.querySelector(".q0").value
            );

        const q1 =
            parseFloat(
                row.querySelector(".q1").value
            );


        // VALIDATION

        if (
            !Number.isFinite(p0) ||
            !Number.isFinite(p1) ||
            !Number.isFinite(q0) ||
            !Number.isFinite(q1)
        ) {

            showError(
                `Please fill all values for Article ${i + 1}.`
            );

            return;
        }


        if (
            p0 < 0 ||
            p1 < 0 ||
            q0 < 0 ||
            q1 < 0
        ) {

            showError(
                "Prices and quantities cannot be negative."
            );

            return;
        }


        // CALCULATIONS

        const p0q0 =
            p0 * q0;

        const p1q0 =
            p1 * q0;

        const p0q1 =
            p0 * q1;

        const p1q1 =
            p1 * q1;


        const quantityBoth =
            q0 + q1;


        const p1Both =
            p1 * quantityBoth;

        const p0Both =
            p0 * quantityBoth;


        // TOTALS

        totalP0Q0 += p0q0;

        totalP1Q0 += p1q0;

        totalP0Q1 += p0q1;

        totalP1Q1 += p1q1;

        totalP1Both += p1Both;

        totalP0Both += p0Both;


        // CALCULATION TABLE

        const calcRow =
            document.createElement("tr");

        calcRow.innerHTML = `

            <td>
                Article ${i + 1}
            </td>

            <td>${format(p0q0)}</td>

            <td>${format(p1q0)}</td>

            <td>${format(p0q1)}</td>

            <td>${format(p1q1)}</td>

            <td>${format(p1Both)}</td>

            <td>${format(p0Both)}</td>

        `;

        calculationBody.appendChild(calcRow);


        // STEP

        steps += `

            <h3>Article ${i + 1}</h3>

            <div class="step-box">

                P₀Q₀ =
                ${format(p0)} × ${format(q0)}
                =
                <strong>${format(p0q0)}</strong>

                <br>

                P₁Q₀ =
                ${format(p1)} × ${format(q0)}
                =
                <strong>${format(p1q0)}</strong>

                <br>

                P₀Q₁ =
                ${format(p0)} × ${format(q1)}
                =
                <strong>${format(p0q1)}</strong>

                <br>

                P₁Q₁ =
                ${format(p1)} × ${format(q1)}
                =
                <strong>${format(p1q1)}</strong>

            </div>

        `;

    }


    // ---------------------------------
    // DISPLAY TOTALS
    // ---------------------------------

    document.getElementById("totalP0Q0").textContent =
        format(totalP0Q0);

    document.getElementById("totalP1Q0").textContent =
        format(totalP1Q0);

    document.getElementById("totalP0Q1").textContent =
        format(totalP0Q1);

    document.getElementById("totalP1Q1").textContent =
        format(totalP1Q1);

    document.getElementById("totalP1Both").textContent =
        format(totalP1Both);

    document.getElementById("totalP0Both").textContent =
        format(totalP0Both);


    // ---------------------------------
    // LASPEYRES
    // ---------------------------------

    const laspeyres =
        (totalP1Q0 / totalP0Q0) * 100;


    // ---------------------------------
    // PAASCHE
    // ---------------------------------

    const paasche =
        (totalP1Q1 / totalP0Q1) * 100;


    // ---------------------------------
    // FISHER
    // ---------------------------------

    const fisher =
        Math.sqrt(
            laspeyres * paasche
        );


    // ---------------------------------
    // MARSHALL-EDGEWORTH
    // ---------------------------------

    const marshall =
        (totalP1Both / totalP0Both) * 100;


    // ---------------------------------
    // DISPLAY RESULTS
    // ---------------------------------

    document.getElementById("laspeyres").textContent =
        format(laspeyres);

    document.getElementById("paasche").textContent =
        format(paasche);

    document.getElementById("fisher").textContent =
        format(fisher);

    document.getElementById("marshall").textContent =
        format(marshall);


    // ---------------------------------
    // STEP-BY-STEP
    // ---------------------------------

    steps += `

        <hr>

        <h3>1. Laspeyres Price Index</h3>

        <div class="step-box">

            (${format(totalP1Q0)}
            ÷
            ${format(totalP0Q0)})
            × 100

            =

            <strong>${format(laspeyres)}</strong>

        </div>


        <h3>2. Paasche Price Index</h3>

        <div class="step-box">

            (${format(totalP1Q1)}
            ÷
            ${format(totalP0Q1)})
            × 100

            =

            <strong>${format(paasche)}</strong>

        </div>


        <h3>3. Fisher Price Index</h3>

        <div class="step-box">

            (${format(laspeyres)}
            ×
            ${format(paasche)})<sup>1/2</sup>

            =

            <strong>${format(fisher)}</strong>

        </div>


        <h3>4. Marshall–Edgeworth Price Index</h3>

        <div class="step-box">

            [${format(totalP1Both)}
            ÷
            ${format(totalP0Both)}]
            × 100

            =

            <strong>${format(marshall)}</strong>

        </div>

    `;


    document.getElementById("steps").innerHTML =
        steps;


    // SHOW SECTIONS

    document
        .getElementById("resultsSection")
        .classList.remove("hidden");

    document
        .getElementById("calculationSection")
        .classList.remove("hidden");

    document
        .getElementById("stepsSection")
        .classList.remove("hidden");


    clearError();


    // SCROLL TO RESULTS

    document
        .getElementById("resultsSection")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// -------------------------------------
// EXAMPLE
// -------------------------------------

function loadExample() {

    document.getElementById("articleCount").value = 4;

    createTable();


    const rows =
        document.querySelectorAll("#inputBody tr");


    const example = [

        {
            p0: 5,
            p1: 6.5,
            q0: 5,
            q1: 7
        },

        {
            p0: 7.75,
            p1: 8.8,
            q0: 6,
            q1: 10
        },

        {
            p0: 9.63,
            p1: 7.15,
            q0: 4,
            q1: 6
        },

        {
            p0: 12.5,
            p1: 12.75,
            q0: 9,
            q1: 9
        }

    ];


    rows.forEach((row, index) => {

        row.querySelector(".p0").value =
            example[index].p0;

        row.querySelector(".p1").value =
            example[index].p1;

        row.querySelector(".q0").value =
            example[index].q0;

        row.querySelector(".q1").value =
            example[index].q1;

    });


    calculate();

}


// -------------------------------------
// RESET
// -------------------------------------

function resetCalculator() {

    document.getElementById("articleCount").value = 4;

    createTable();

    clearError();

}


// -------------------------------------
// DARK MODE
// -------------------------------------

function toggleTheme() {

    document.body.classList.toggle("dark");


    const dark =
        document.body.classList.contains("dark");


    document.getElementById("themeBtn").textContent =
        dark ? "☀️" : "🌙";


    localStorage.setItem(
        "darkMode",
        dark
    );

}


// -------------------------------------
// COPY RESULTS
// -------------------------------------

function copyResults() {

    const text = `

IndexMaster Results

Laspeyres: ${document.getElementById("laspeyres").textContent}

Paasche: ${document.getElementById("paasche").textContent}

Fisher: ${document.getElementById("fisher").textContent}

Marshall–Edgeworth: ${document.getElementById("marshall").textContent}

    `.trim();


    navigator.clipboard.writeText(text);


    const button =
        document.getElementById("copyBtn");


    button.textContent = "✓ Copied!";


    setTimeout(() => {

        button.textContent =
            "📋 Copy Results";

    }, 1500);

}


// -------------------------------------
// FORMAT NUMBER
// -------------------------------------

function format(number) {

    return Number(number).toFixed(2);

}


// -------------------------------------
// ERROR FUNCTIONS
// -------------------------------------

function showError(message) {

    document.getElementById("errorMessage").textContent =
        message;

}


function clearError() {

    document.getElementById("errorMessage").textContent =
        "";

}


// -------------------------------------
// HIDE RESULTS
// -------------------------------------

function hideResults() {

    document
        .getElementById("resultsSection")
        .classList.add("hidden");

    document
        .getElementById("calculationSection")
        .classList.add("hidden");

    document
        .getElementById("stepsSection")
        .classList.add("hidden");

}


// -------------------------------------
// BUTTON EVENTS
// -------------------------------------

document
    .getElementById("generateBtn")
    .addEventListener(
        "click",
        createTable
    );


document
    .getElementById("exampleBtn")
    .addEventListener(
        "click",
        loadExample
    );


document
    .getElementById("resetBtn")
    .addEventListener(
        "click",
        resetCalculator
    );


document
    .getElementById("calculateBtn")
    .addEventListener(
        "click",
        calculate
    );


document
    .getElementById("addBtn")
    .addEventListener(
        "click",
        () => {

            const rows =
                document.querySelectorAll(
                    "#inputBody tr"
                );

            if (rows.length >= 50) {

                showError(
                    "Maximum 50 articles allowed."
                );

                return;
            }

            addArticleRow(
                rows.length + 1
            );

            document.getElementById(
                "articleCount"
            ).value = rows.length + 1;

        }
    );


document
    .getElementById("themeBtn")
    .addEventListener(
        "click",
        toggleTheme
    );


document
    .getElementById("copyBtn")
    .addEventListener(
        "click",
        copyResults
    );


// -------------------------------------
// LOAD SAVED THEME
// -------------------------------------

if (
    localStorage.getItem("darkMode") === "true"
) {

    document.body.classList.add("dark");

    document.getElementById("themeBtn").textContent =
        "☀️";

}


// -------------------------------------
// INITIAL TABLE
// -------------------------------------

createTable();
