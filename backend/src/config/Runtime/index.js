const ConfigManager = require('../utils/configManager');

// Create a single instance of ConfigManager
const configManager = new ConfigManager();

/**
 * Initialize runtime configuration
 */
async function initRuntimeConfig() {
  try {
    await configManager.loadConfig();
    global.myConfig = configManager.getAllConfig();
    console.log('Runtime configuration initialized');
  } catch (err) {
    console.error('Config initialization failed:', err.message);
    throw err;
  }
}

/**
 * Reload runtime configuration
 */
async function reloadRuntimeConfig() {
  try {
    await configManager.loadConfig();
    global.myConfig = configManager.getAllConfig();
    console.log('Runtime configuration reloaded');
  } catch (err) {
    console.error('Failed to reload config:', err.message);
  }
}

/**
 * Get configuration value
 */
function getConfig(key) {
  return configManager.getConfig(key);
}

/**
 * Start automatic configuration refresh
 */
function startConfigAutoRefresh(intervalMs = 300000) {
  setInterval(reloadRuntimeConfig, intervalMs);
  console.log(`Auto-refresh started (every ${intervalMs / 1000}s)`);
}

module.exports = {
  initRuntimeConfig,
  reloadRuntimeConfig,
  getConfig,
  startConfigAutoRefresh
};
