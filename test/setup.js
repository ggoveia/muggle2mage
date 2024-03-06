// In test/setup.js

const fs = require('fs');
const toml = require('toml');

// Read wrangler.toml file
const wranglerTomlPath = '../muggle2mage/wrangler.toml'; // Update this path
const wranglerTomlContent = fs.readFileSync(wranglerTomlPath, 'utf-8');

// Parse wrangler.toml content
const wranglerConfig = toml.parse(wranglerTomlContent);

// Set OPENAI_API_KEY as an environment variable
process.env.OPENAI_API_KEY = wranglerConfig.vars.OPENAI_API_KEY;

// Setup fetch mock for all tests
const fetchMock = require('fetch-mock-jest');
global.fetch = fetchMock.sandbox();