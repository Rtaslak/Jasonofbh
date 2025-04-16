/**
 * Environment utility for identifying app environment
 */

export const isLocalEnvironment = (): boolean => {
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1';
};

export const isTestEnvironment = (): boolean => {
  return window.location.hostname === 'test.jasonofbh.com' || 
         window.location.hostname === 'test.jasonofbh.net' || 
         window.location.hostname === 'jasonofbh.net';
};

export const isProductionEnvironment = (): boolean => {
  return !isLocalEnvironment() && !isTestEnvironment();
};

// Clean export object
const environmentUtils = {
  isLocalEnvironment,
  isTestEnvironment,
  isProductionEnvironment
};

export default environmentUtils;
