const RESOURCE_INCLUDED_KEYS = ["height", "public_id", "resource_type", "secure_url", "width"];

/**
 * sanitizeResource
 */

export function sanitizeResource(resource) {
  return Object.fromEntries(Object.entries(resource).filter(([key]) => RESOURCE_INCLUDED_KEYS.includes(key)));
}