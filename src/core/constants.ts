/**
 * Shared constants for schema version, ID handling, and other core values
 */

/** Current schema version for saved maps */
export const SCHEMA_VERSION = '1.0.0';

/** Prefix used for generating stable node IDs */
export const ID_PREFIX = 'node';

/** Separator for hierarchical path construction */
export const PATH_SEPARATOR = ' > ';

/** Date format used in exports and storage (ISO 8601) */
export const DATE_FORMAT = 'YYYY-MM-DD';

/** Timeout for file operations in milliseconds */
export const FILE_OPERATION_TIMEOUT = 5000;

/** Maximum nodes before warning about performance */
export const PERF_WARNING_NODE_COUNT = 500;

/** Status options for plan fields */
export const PLAN_STATUS_OPTIONS = [
  'Not Started',
  'In Progress',
  'Completed',
] as const;

/** Default map title when creating new maps */
export const DEFAULT_MAP_TITLE = 'Untitled Map';
