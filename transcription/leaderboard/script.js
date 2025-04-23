const CSV_URL = "leaderboard/leaderboard.csv";
const jsondirectoryPath = "./data/ReconVAT.json";

// Function to format timestamps efficiently
function formatTimestamp(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
    });
}

// Fetch CSV data
async function fetchCSV() {
    try {
        const response = await fetch(CSV_URL);
        const csvContent = await response.text();
        parseCSV(csvContent);
    } catch (error) {
        console.error("Error fetching CSV data:", error);
    }
}

// Parse CSV data
function parseCSV(csvContent) {
    const rows = csvContent.trim().split("\n");
    console.log("CSV Rows:", rows);
    const leaderboardEntries = [];
    rows.slice(1).map((row) => {
        const columns = row
            .match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)
            .map((col) => col.replace(/^"|"$/g, ""));
        leaderboardEntries.push({
            teamName: columns[0],
            timestamp: formatTimestamp(columns[2]),
            teamMembers: columns[1],
            runtime: columns[3],
            f1score: parseFloat(columns[4]),
        });
    });

    window.leaderboardEntries = leaderboardEntries;

    localStorage.setItem("leaderboardData", JSON.stringify(leaderboardEntries));
    localStorage.setItem("leaderboardTimestamp", Date.now());

    // Sort by f1score descending
    leaderboardEntries.sort((a, b) => b.f1score - a.f1score);

    // Update the leaderboard
    updateLeaderboard(leaderboardEntries);
}

// Update leaderboard efficiently
function updateLeaderboard(entries) {
    const leaderboardBody = document.getElementById("leaderboard-body");
    let htmlContent = "";

    entries.forEach((entry, index) => {
        htmlContent += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${entry.teamName}</td>
                    <td>${entry.timestamp}</td>
                    <td>${entry.runtime} ms</td>
                    <td><a href="#" class="score-link" data-index="${
                        entry.f1score
                    }">${entry.f1score}</a></td>
                </tr>
            `;
    });
    console.log("HTML Content:", htmlContent);
    leaderboardBody.innerHTML = htmlContent; // Update in one go

    // Use event delegation for efficiency
    document
        .getElementById("leaderboard-body")
        .addEventListener("click", function (event) {
            if (event.target.classList.contains("score-link")) {
                event.preventDefault();
                showDialogBox(event.target.getAttribute("data-index"));
            }
        });
}

// Show dialog box with team details
function showDialogBox(f1score) {
    const entry = window.leaderboardEntries.find((e) => e.f1score == f1score);

    fetchJsonFile(entry.teamName).then((jsonData) => {
        if (!jsonData) return;

        document.getElementById("dialogContent").innerHTML = `
                <p><strong>Team Name:</strong> ${entry.teamName}</p>
                <p><strong>Team Members:</strong> ${jsonData[0].teamMembers}</p>
                <p><strong>Timestamp:</strong> ${entry.timestamp}</p>
                <p><strong>Runtime:</strong> ${entry.runtime} ms</p>
                <p><strong>F1 Score:</strong> ${entry.f1score}</p>
                <p><strong>Precision Score:</strong> ${jsonData[0].Precision}</p>
                <p><strong>Recall Score:</strong> ${jsonData[0].Recall}</p>
                <p><strong>Overlap Score:</strong> ${jsonData[0].Average_Overlap_Ratio}</p>
            `;

        document.getElementById("dialogOverlay").classList.add("active");
        document.getElementById("dialogBox").classList.add("active");
    });
}

// Fetch JSON file for the team
function fetchJsonFile(teamName) {
    const jsonFilePath = `./leaderboard/data/${teamName}.json`;

    // Use fetch to load the JSON file
    return fetch(jsonFilePath)
        .then((response) => {
            if (!response.ok) {
                throw new Error(
                    `Error fetching JSON file for team: ${teamName}`
                );
            }
            return response.json();
        })
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.error("Error fetching JSON file:", error);
        });
}

// Close dialog box
function closeDialogBox() {
    document.getElementById("dialogOverlay").classList.remove("active");
    document.getElementById("dialogBox").classList.remove("active");
}

// Fetch leaderboard on page load
fetchCSV();
