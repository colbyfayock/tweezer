const RESOURCE_INCLUDED_KEYS = ["height", "info", "public_id", "resource_type", "secure_url", "tags", "width"];

/**
 * sanitizeResource
 */

export function sanitizeResource(resource) {
  return Object.fromEntries(Object.entries(resource).filter(([key]) => RESOURCE_INCLUDED_KEYS.includes(key)));
}