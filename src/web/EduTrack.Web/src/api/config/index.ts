/**
 * API configuration helpers.
 * Authentication token and tenant context management, plus header building.
 * 
 * @module api/config
 */

export { getAuthToken, getCurrentTenantId } from './auth';
export { buildHeaders } from './headers';
