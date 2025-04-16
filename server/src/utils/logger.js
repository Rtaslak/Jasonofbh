// Configuration
const DEBUG = process.env.DEBUG === 'true';

// Helper for debug logging
function logDebug(message, ...args) {
  if (DEBUG) {
    console.log(`[DEBUG] ${message}`, ...args);
  }
}

// Helper for warning logging - always shown
function logWarn(message, ...args) {
  console.warn(`[WARN] ${message}`, ...args);
}

// Helper for error logging - always shown
function logError(message, ...args) {
  console.error(`[ERROR] ${message}`, ...args);
}

// Helper for info logging - always shown
function logInfo(message, ...args) {
  console.info(`[INFO] ${message}`, ...args);
}

module.exports = {
  logDebug,
  logWarn, // ✅ added
  logError,
  logInfo
};
