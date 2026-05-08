// Import your custom middleware (adjust path as needed)
const { Log } = require('./logging_middleware'); 

const API_URL = 'http://4.224.186.213/evaluation-service/notifications';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJkaGluZXNoa3VtYXIuY3MyM0BiaXRzYXRoeS5hYy5pbiIsImV4cCI6MTc3ODIzNDk4MiwiaWF0IjoxNzc4MjM0MDgyLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZmYzYjU4NjctNWY3ZC00YWY4LTgwMzktZDA1OWM1Y2UzZDAzIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiZGhpbmVzaGt1bWFyIiwic3ViIjoiODQ0OGMxM2YtMTliYy00MTFjLTkwNTktZDYxNjE4OTk5MzVmIn0sImVtYWlsIjoiZGhpbmVzaGt1bWFyLmNzMjNAYml0c2F0aHkuYWMuaW4iLCJuYW1lIjoiZGhpbmVzaGt1bWFyIiwicm9sbE5vIjoiNzM3NjIzMWNzMTQ0IiwiYWNjZXNzQ29kZSI6InVLYUpmbSIsImNsaWVudElEIjoiODQ0OGMxM2YtMTliYy00MTFjLTkwNTktZDYxNjE4OTk5MzVmIiwiY2xpZW50U2VjcmV0Ijoid05BWVFtTmhjZUZTWkZ2USJ9.OaeBIKc4mxHGBFRNPaZ0Ab6UNi9zpVvx1nG4qLvpNRI';

// Helper function to assign weights based on the prompt's rules
const getPriorityWeight = (type) => {
    switch (type) {
        case 'Placement': return 3;
        case 'Result': return 2;
        case 'Event': return 1;
        default: return 0;
    }
};

const getTop10Notifications = async () => {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${TOKEN}` }
        });

        if (!response.ok) {
            throw new Error(`API failed with status: ${response.status}`);
        }

        const data = await response.json();
        const notifications = data.notifications || [];

        // Core Algorithm: Sort by Weight, then by Timestamp
        const sortedNotifications = notifications.sort((a, b) => {
            const weightA = getPriorityWeight(a.Type);
            const weightB = getPriorityWeight(b.Type);

            if (weightA !== weightB) {
                return weightB - weightA; // Descending weight
            }
            
            // If weights are equal, sort by recency (newest first)
            return new Date(b.Timestamp) - new Date(a.Timestamp);
        });

        // Extract top 10
        const top10 = sortedNotifications.slice(0, 10);

        // Required by rubric: Log the successful execution via middleware
        await Log("backend", "info", "stage1_script", "Successfully computed top 10 priority notifications.");

        // Print to terminal for your required screenshot
        process.stdout.write("--- TOP 10 PRIORITY NOTIFICATIONS ---\n");
        process.stdout.write(JSON.stringify(top10, null, 2) + "\n");

    } catch (error) {
        await Log("backend", "error", "stage1_script", `Failed to fetch or sort: ${error.message}`);
        process.stdout.write(`Error: ${error.message}\n`);
    }
};

getTop10Notifications();