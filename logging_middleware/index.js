// logging_middleware/index.js

// Ideally, store this token in your environment variables (.env)
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJkaGluZXNoa3VtYXIuY3MyM0BiaXRzYXRoeS5hYy5pbiIsImV4cCI6MTc3ODIzNDk4MiwiaWF0IjoxNzc4MjM0MDgyLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZmYzYjU4NjctNWY3ZC00YWY4LTgwMzktZDA1OWM1Y2UzZDAzIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiZGhpbmVzaGt1bWFyIiwic3ViIjoiODQ0OGMxM2YtMTliYy00MTFjLTkwNTktZDYxNjE4OTk5MzVmIn0sImVtYWlsIjoiZGhpbmVzaGt1bWFyLmNzMjNAYml0c2F0aHkuYWMuaW4iLCJuYW1lIjoiZGhpbmVzaGt1bWFyIiwicm9sbE5vIjoiNzM3NjIzMWNzMTQ0IiwiYWNjZXNzQ29kZSI6InVLYUpmbSIsImNsaWVudElEIjoiODQ0OGMxM2YtMTliYy00MTFjLTkwNTktZDYxNjE4OTk5MzVmIiwiY2xpZW50U2VjcmV0Ijoid05BWVFtTmhjZUZTWkZ2USJ9.OaeBIKc4mxHGBFRNPaZ0Ab6UNi9zpVvx1nG4qLvpNRI"; 
const LOG_API_URL = 'http://4.224.186.213/evaluation-service/logs';

/**
 * Sends log data to the remote Test Server.
 * * @param {string} stack - Must be 'backend' or 'frontend'
 * @param {string} level - E.g., 'debug', 'info', 'warn', 'error', 'fatal'
 * @param {string} pkg - The package, handler, or module name
 * @param {string} message - The actual log description
 */
const Log = async (stack, level, pkg, message) => {
    try {
        // The constraints state these MUST be lower case
        const payload = {
            stack: stack.toLowerCase(),
            level: level.toLowerCase(),
            package: pkg.toLowerCase(),
            message: message
        };

        const response = await fetch(LOG_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AUTH_TOKEN}` // Requires the token from Step 2
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error('Failed to send log to server:', response.statusText);
        }
    } catch (error) {
        // Fallback to local console if the network request fails
        console.error('Logging Middleware Error:', error.message);
    }
};

module.exports = { Log };