// Mock data to simulate a leaderboard
const mockData = [
    { name: "Alice", score: 95 },
    { name: "Bob", score: 87 },
    { name: "Charlie", score: 78 },
    { name: "David", score: 67 }
];

const API_URL = "https://script.google.com/macros/s/AKfycbwfSfrpYZHyK1aZ_D19L5ajf9UvoZsyiVO9HX962GTJru8wyDr6FexsVIrcrbAN1Qb1/exec"; 

// Function to fetch the data from Google Sheets (through Google Apps Script)
async function fetchLeaderboardData() {
    try {
        // Fetch data from the web app (Google Apps Script URL)
        const response = await fetch(API_URL);
        const data = await response.json();  // Parse the JSON response
        console.log("Fetched Data: ", data.values)
        const leaderboardEntries = data.values.map(row => ({
            name: row[0],  // 'name' column (A)
            email: row[1], // 'email' column (B)
            score: row[2], // 'score' column (C)
            secret: row[3], // 'secret' column (D)
            gitRepo: row[4], // 'git repo' column (E)
            id: row[5]  // 'id' column (F)
        }));

        // Now update the leaderboard with the real data
        updateLeaderboard(leaderboardEntries);  
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
    }
}

// Function to update the leaderboard with mock data
function updateLeaderboard(entries) {
    const leaderboardBody = document.getElementById('leaderboard-body');
    leaderboardBody.innerHTML = '';  // Clear existing data

    entries.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.email}</td>
            <td>${entry.score}</td>
            <td>${entry.secret}</td>
            <td><a href="${entry.gitRepo}" target="_blank">${entry.gitRepo}</a></td>
            <td>${entry.id}</td>
        `;
        leaderboardBody.appendChild(row);
    });
}

// Simulate the leaderboard update when the page loads
// updateLeaderboard(mockData);
fetchLeaderboardData();
