// logging_middleware/index.js

// Ideally, store this token in your environment variables (.env)
const AUTH_TOKEN = process.env.AFFORDMED_AUTH_TOKEN; 
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