
/**
 * Interface for fetch options with additional API client options
 */
export interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
  useMockOnFailure?: boolean;
}
