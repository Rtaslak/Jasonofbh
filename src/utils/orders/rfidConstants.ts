
/**
 * Constants for RFID tag processing
 */

// TTL duration in milliseconds (1 minute)
export const TAG_TTL_DURATION = 60000;

// Minimum time between processing the same tag (in milliseconds)
export const TAG_RATE_LIMIT = 3000; // 3 seconds

// Emit rate limit (in milliseconds)
export const EMIT_RATE_LIMIT = 2000; // 2 seconds

// Batch processing interval (in milliseconds)
export const BATCH_PROCESSING_INTERVAL = 100; // 100ms

// Tag expiration check interval (in milliseconds)
export const TAG_EXPIRATION_CHECK_INTERVAL = 10000; // 10 seconds

