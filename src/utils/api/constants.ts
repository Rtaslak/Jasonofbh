// src/api/constants.ts

/**
 * Lock in the real backend API base URL.
 * Remove mock support permanently.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Always use real backend
export const isMockMode = false;
export const isProduction = import.meta.env.MODE === 'production';
export const isTestEnvironment = import.meta.env.MODE === 'test';
export const isLovableEnvironment = false;
