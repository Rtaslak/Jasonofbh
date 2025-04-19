// src/utils/orders/tagTracking.ts

import { TAG_RATE_LIMIT } from "./rfidConstants";


type TagRead = {
  tagId: string;
  timestamp: number;
  readerId?: string;
};

// In-memory cache to track recent tag reads
const recentTagReads = new Map<string, TagRead>();

/**
 * Check if a tag read is a duplicate (within TTL window)
 */
export function isDuplicateTagRead(tagId: string, readerId?: string): boolean {
  const key = getLocationKey(tagId, readerId);
  const lastRead = recentTagReads.get(key);
  const now = Date.now();

  if (lastRead && now - lastRead.timestamp < TAG_RATE_LIMIT) {
    return true; // It's a duplicate
  }

  // Otherwise, store new read timestamp
  recentTagReads.set(key, {
    tagId,
    timestamp: now,
    readerId
  });

  return false;
}

/**
 * Clean up expired tag reads from memory
 */
export function checkAndRemoveExpiredTagReadings() {
  const now = Date.now();
  for (const [key, read] of recentTagReads.entries()) {
    if (now - read.timestamp > TAG_RATE_LIMIT) {
      recentTagReads.delete(key);
    }
  }

  // Optionally emit to the UI that cleanup happened
  window.dispatchEvent(new CustomEvent("orderUpdated", {
    detail: {
      expired: true,
      metrics: {
        lastCheckTime: now,
        totalExpired: recentTagReads.size,
      }
    }
  }));
}

/**
 * Generates a unique cache key per tag + location
 */
function getLocationKey(tagId: string, readerId?: string): string {
  return `${tagId.toLowerCase()}-${(readerId || "default").toLowerCase()}`;
}
