// Mock data to simulate a leaderboard
const mockData = [
    { name: "Alice", score: 95 },
    { name: "Bob", score: 87 },
    { name: "Charlie", score: 78 },
    { name: "David", score: 67 }
];
// const API_URL = 'https://script.google.com/macros/s/.../exec';  // Replace with your actual web app URL

// Function to fetch the data from Google Sheets (through Google Apps Script)
// async function fetchLeaderboardData() {
//     try {
//         // Fetch data from the web app (Google Apps Script URL)
//         const response = await fetch(API_URL);
//         const data = await response.json();  // Parse the JSON response

//         // Now update the leaderboard with the real data
//         updateLeaderboard(data.values);  // 'data.values' contains the real entries from the Google Sheet
//     } catch (error) {
//         console.error('Error fetching leaderboard data:', error);
//     }
// }

// Function to update the leaderboard with mock data
function updateLeaderboard(entries) {
    const leaderboardBody = document.getElementById('leaderboard-body');
    leaderboardBody.innerHTML = '';  // Clear existing data

    entries.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.score}</td>
        `;
        leaderboardBody.appendChild(row);
    });
}

// Simulate the leaderboard update when the page loads
updateLeaderboard(mockData);
