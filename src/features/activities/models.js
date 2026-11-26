/**
 * @typedef {"book" | "drawing" | "writing"} ActivityType
 */

/**
 * @typedef {Object} Step
 * @property {string} id
 * @property {string} title
 * @property {string} instruction
 * @property {string} helpText
 * @property {string} icon
 */

/**
 * @typedef {Object} Activity
 * @property {string} id
 * @property {1} schemaVersion
 * @property {string} title
 * @property {ActivityType} type
 * @property {"id-ID"} language
 * @property {Record<string, unknown>} formData
 * @property {Step[]} steps
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} StoredData
 * @property {1} schemaVersion
 * @property {Activity[]} activities
 */

export const SCHEMA_VERSION = 1;
export const STORAGE_KEY = "langkahkecil:activities:v1";

export const LIMITS = Object.freeze({
  activityTitle: 100,
  stepTitle: 100,
  instruction: 300,
  helpText: 300,
  minSteps: 1,
  maxSteps: 20,
});