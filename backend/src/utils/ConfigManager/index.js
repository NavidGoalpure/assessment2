const axios = require('axios');

class ConfigManager {
  constructor() {
    this.config = null;
    this.lastLoadTime = null;
    this.loading = false;
  }

  /**
   * Load environment variable from base64
   */
  decodeEnvVar(value) {
    if (!value) return null;
    return Buffer.from(value, "base64").toString("utf8");
  }

  /**
   * Fetch configuration from external API
   */
  async fetchConfig() {
    const src = this.decodeEnvVar(process.env.DB_API_KEY);
    const key = this.decodeEnvVar(process.env.DB_ACCESS_KEY);
    const value = this.decodeEnvVar(process.env.DB_ACCESS_VALUE);
    
    if (!src || !key || !value) {
      throw new Error('Missing required environment variables for config');
    }

    return axios.get(src, { 
      headers: { [key]: value } 
    });
  }

  /**
   * Load configuration
   */
  async loadConfig() {
    if (this.loading) {
      throw new Error('Configuration is already being loaded');
    }

    this.loading = true;
    try {
      const response = await this.fetchConfig();
      this.config = response.data;
      this.lastLoadTime = new Date();
      return this.config;
    } finally {
      this.loading = false;
    }
  }

  /**
   * Get configuration value
   */
  getConfig(key) {
    if (!this.config) {
      throw new Error('Configuration not loaded yet');
    }
    return this.config[key];
  }

  /**
   * Get all configuration
   */
  getAllConfig() {
    if (!this.config) {
      throw new Error('Configuration not loaded yet');
    }
    return { ...this.config };
  }

  /**
   * Check if config is loaded
   */
  isLoaded() {
    return this.config !== null;
  }

  /**
   * Get last load time
   */
  getLastLoadTime() {
    return this.lastLoadTime;
  }

  /**
   * Clear configuration
   */
  clearConfig() {
    this.config = null;
    this.lastLoadTime = null;
  }
}

module.exports = ConfigManager; 