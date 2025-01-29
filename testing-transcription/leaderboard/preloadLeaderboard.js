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

// Preload leaderboard data in the background
async function preloadLeaderboardData() {
    try {
        const response = await fetch(API_URL, { cache: "no-cache" });
        const data = await response.json();

        // Process leaderboard entries
        const leaderboardEntries = data.values.map((row) => ({
            timestamp: formatTimestamp(row[0]),
            teamName: row[1],
            teamMembers: row[2],
            score: +row[3], // Using unary + for fast number conversion
        }));

        // Sort by score descending
        leaderboardEntries.sort((a, b) => b.score - a.score);

        // Store in localStorage for leaderboard page to use
        localStorage.setItem("leaderboardData", JSON.stringify(leaderboardEntries));
        localStorage.setItem("leaderboardTimestamp", Date.now()); // Store timestamp for freshness
    } catch (error) {
        console.error("Error preloading leaderboard data:", error);
    }
}

// Run preload when the page loads
window.addEventListener("DOMContentLoaded", () => {
    preloadLeaderboardData();
});
