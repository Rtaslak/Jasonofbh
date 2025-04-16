
/**
 * Validates if an email belongs to the allowed domain
 * @param email The email to validate
 * @returns true if the email is valid, false otherwise
 */
export const validateEmail = (email: string): boolean => {
  if (!email) return false;
  
  // Convert to lowercase to make it case-insensitive
  const lowercaseEmail = email.toLowerCase();
  
  // Always allow admin@jasonofbh.com
  if (lowercaseEmail === 'admin@jasonofbh.com') {
    return true;
  }
  
  // Check if it ends with @jasonofbh.com
  return lowercaseEmail.endsWith('@jasonofbh.com');
};

/**
 * Mocks an authentication API call
 * In a real application, this would communicate with your backend
 */
export const mockAuthCall = async (email: string, password: string): Promise<boolean> => {
  // This is just a mock - in a real app, you'd make an API call here
  return new Promise((resolve) => {
    setTimeout(() => {
      // For testing purposes, always return true
      resolve(true);
    }, 1000);
  });
};
