/**
 * Simple .env file loader - Alternative to dotenv package
 * Reads .env file and sets environment variables
 */

const fs = require('fs');
const path = require('path');

function loadEnv(envFilePath = '.env') {
    try {
        // Look for .env file in project root
        const projectRoot = path.resolve(__dirname, '..');
        const fullPath = path.join(projectRoot, envFilePath);
        
        if (!fs.existsSync(fullPath)) {
            console.log(`No ${envFilePath} file found, using system environment variables only`);
            return;
        }

        const envContent = fs.readFileSync(fullPath, 'utf8');
        
        // Parse each line
        envContent.split('\n').forEach(line => {
            // Skip empty lines and comments
            line = line.trim();
            if (!line || line.startsWith('#')) {
                return;
            }
            
            // Parse KEY=VALUE format
            const equalIndex = line.indexOf('=');
            if (equalIndex === -1) {
                return;
            }
            
            const key = line.slice(0, equalIndex).trim();
            let value = line.slice(equalIndex + 1).trim();
            
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            
            // Only set if not already in environment
            if (!process.env[key]) {
                process.env[key] = value;
            }
        });
        
        console.log(`Loaded environment variables from ${envFilePath}`);
    } catch (error) {
        console.warn(`Could not load ${envFilePath}:`, error.message);
    }
}

// Function to use like dotenv.config()
function config(options = {}) {
    const envPath = options.path || '.env';
    loadEnv(envPath);
    return { parsed: process.env };
}

module.exports = {
    config,
    loadEnv
};