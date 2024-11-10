const API_URL = "https://script.google.com/macros/s/AKfycbzfSorh2MlYMvXO06mQsvG_O3O7s7heMufcRPtFvMkwdewD13Xnr92KTjibxZGLn5BlAg/exec"; 

function formatTimestamp(isoString) {
    const date = new Date(isoString);

    // Extract date components
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();

    // Extract time components
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    // Determine AM/PM and adjust hours
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 (midnight) and 12 (noon) correctly

    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
}

// Function to fetch the data from Google Sheets (through Google Apps Script)
async function fetchLeaderboardData() {
    try {
        // Fetch data from the web app (Google Apps Script URL)
        const response = await fetch(API_URL);
        const data = await response.json();  // Parse the JSON response
        console.log("Fetched Data: ", data.values)
        const leaderboardEntries = data.values.map(row => ({
            timestamp: formatTimestamp(row[0]), 
            email: row[1], 
            teamname: row[2], 
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
            <td>${entry.timestamp}</td>
            <td>${entry.email}</td>
            <td>${entry.teamname}</td>
        `;
        leaderboardBody.appendChild(row);
    });
}

// Simulate the leaderboard update when the page loads
// updateLeaderboard(mockData);
fetchLeaderboardData();
