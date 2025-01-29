const API_URL =
    "https://script.google.com/macros/s/AKfycbwuaF0cEmmuYw1_nJobHlCbEQoEQJwbC9_wES_Az5UH91-U4_IdFEOnnc-rRFY6QrtiNw/exec";

// Function to format timestamps efficiently
function formatTimestamp(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });
}

// Fetch data from Google Sheets API
async function fetchLeaderboardData() {
    const cachedData = localStorage.getItem("leaderboardData");
    const cacheTimestamp = localStorage.getItem("leaderboardTimestamp");

    // Check if cached data exists and is fresh, within the last minute
    if (cachedData && cacheTimestamp && Date.now() - cacheTimestamp < 60 * 1000) {
        console.log("Using preloaded leaderboard data");
        updateLeaderboard(JSON.parse(cachedData)); // Use preloaded data
    } else {
        console.log("Fetching leaderboard data from API");
        try {
            const response = await fetch(API_URL, { cache: "no-cache" });
            const data = await response.json();

            // Process leaderboard entries
            const leaderboardEntries = data.values.map((row) => ({
                timestamp: formatTimestamp(row[0]),
                teamName: row[1],
                teamMembers: row[2],
                score: +row[3],
            }));

            // Sort by score descending
            leaderboardEntries.sort((a, b) => b.score - a.score);

            // Store in cache for next time
            localStorage.setItem("leaderboardData", JSON.stringify(leaderboardEntries));
            localStorage.setItem("leaderboardTimestamp", Date.now());

            updateLeaderboard(leaderboardEntries);
        } catch (error) {
            console.error("Error fetching leaderboard data:", error);
        }
    }
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
                <td>${entry.teamMembers}</td>
                <td>${entry.timestamp}</td>
                <td></td>
                <td><a href="#" class="score-link" data-index="${index}">${entry.score}</a></td>
            </tr>
        `;
    });

    leaderboardBody.innerHTML = htmlContent; // Update in one go

    // Use event delegation for efficiency
    document.getElementById("leaderboard-body").addEventListener("click", function (event) {
        if (event.target.classList.contains("score-link")) {
            event.preventDefault();
            showDialogBox(event.target.getAttribute("data-index"));
        }
    });

    window.leaderboardEntries = entries;
}

// Show dialog box with team details
function showDialogBox(index) {
    const entry = window.leaderboardEntries[index];
    document.getElementById("dialogContent").innerHTML = `
        <p><strong>Team Name:</strong> ${entry.teamName}</p>
        <p><strong>Team Members:</strong> ${entry.teamMembers}</p>
        <p><strong>Timestamp:</strong> ${entry.timestamp}</p>
        <p><strong>Score:</strong> ${entry.score}</p>
    `;

    document.getElementById("leaderboard-container").classList.add("dimmed");
    document.getElementById("dialogBox").style.display = "inline";
    document.getElementById("dialogOverlay").style.display = "block";
}

function closeDialogBox() {
    document.getElementById("leaderboard-container").classList.remove("dimmed");
    document.getElementById("dialogBox").style.display = "none";
    document.getElementById("dialogOverlay").style.display = "none";
}

// Fetch leaderboard on page load
fetchLeaderboardData();
