import { SCHEMA_VERSION, STORAGE_KEY } from "./models.js";
import { validateBuilderInput, validateSteps } from "./validators.js";

function fail(code, message) {
  return Object.assign(new Error(message), { code });
}

function isRecord(value) {
  return value !== null &&
    typeof value === "object" &&
    !Array.isArray(value);
}

function isISODate(value) {
  if (typeof value !== "string") return false;
  const date = new Date(value);

  return !Number.isNaN(date.getTime()) &&
    date.toISOString() === value;
}

function isValidActivity(activity) {
  return isRecord(activity) &&
    activity.schemaVersion === SCHEMA_VERSION &&
    typeof activity.id === "string" &&
    Boolean(activity.id.trim()) &&
    activity.language === "id-ID" &&
    isRecord(activity.formData) &&
    isISODate(activity.createdAt) &&
    isISODate(activity.updatedAt) &&
    validateBuilderInput(
      activity.type,
      activity.title,
      activity.formData,
    ).valid &&
    validateSteps(activity.steps).valid;
}

function prepareContent(input) {
  if (!isRecord(input) || !isRecord(input.formData)) {
    throw fail("VALIDATION_ERROR", "Data aktivitas tidak valid.");
  }

  const form = validateBuilderInput(
    input.type,
    input.title,
    input.formData,
  );

  if (!form.valid || !validateSteps(input.steps).valid) {
    throw fail(
      "VALIDATION_ERROR",
      "Periksa judul, formulir, dan instruksi pada setiap kartu.",
    );
  }

  return {
    ...form.data,
    language: "id-ID",
    steps: input.steps.map((step) => ({
      id: step.id,
      title: step.title,
      instruction: step.instruction,
      helpText: step.helpText,
      icon: step.icon,
    })),
  };
}

export function createActivityRepository({
  getStorage = () => globalThis.localStorage,
  now = () => new Date().toISOString(),
} = {}) {
  function read() {
    let raw;

    try {
      raw = getStorage().getItem(STORAGE_KEY);
    } catch {
      throw fail(
        "STORAGE_UNAVAILABLE",
        "Penyimpanan browser tidak dapat diakses. Periksa pengaturan browser.",
      );
    }

    if (raw === null) return [];

    let data;

    try {
      data = JSON.parse(raw);
    } catch {
      throw fail(
        "CORRUPT_DATA",
        "Data tersimpan tidak dapat dibaca. Data lama tidak diubah.",
      );
    }

    if (
      !isRecord(data) ||
      data.schemaVersion !== SCHEMA_VERSION ||
      !Array.isArray(data.activities) ||
      !data.activities.every(isValidActivity) ||
      new Set(data.activities.map((item) => item.id)).size !==
        data.activities.length
    ) {
      throw fail(
        "CORRUPT_DATA",
        "Format data tersimpan tidak valid atau tidak didukung. Data lama tidak diubah.",
      );
    }

    return data.activities;
  }

  function write(activities) {
    const serialized = JSON.stringify({
      schemaVersion: SCHEMA_VERSION,
      activities,
    });

    try {
      getStorage().setItem(STORAGE_KEY, serialized);
    } catch (error) {
      if (error.name === "QuotaExceededError") {
        throw fail(
          "STORAGE_FULL",
          "Penyimpanan browser penuh. Aktivitas belum disimpan.",
        );
      }

      throw fail(
        "WRITE_FAILED",
        "Aktivitas belum disimpan karena penyimpanan browser gagal.",
      );
    }
  }

  function listActivities() {
    return read().sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt),
    );
  }

  function getActivity(id) {
    return read().find((activity) => activity.id === id) ?? null;
  }

  function createActivity(input) {
    const activities = read();
    const content = prepareContent(input);
    const timestamp = now();

    let id;
    do {
      id = crypto.randomUUID();
    } while (activities.some((activity) => activity.id === id));

    const activity = {
      ...content,
      id,
      schemaVersion: SCHEMA_VERSION,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    write([...activities, activity]);
    return activity;
  }

  function updateActivity(id, changes) {
    const activities = read();
    const index = activities.findIndex((activity) => activity.id === id);

    if (index === -1) {
      throw fail("NOT_FOUND", "Aktivitas tidak ditemukan.");
    }

    if (!isRecord(changes)) {
      throw fail("VALIDATION_ERROR", "Perubahan aktivitas tidak valid.");
    }

    const previous = activities[index];
    const content = prepareContent({ ...previous, ...changes });

    const activity = {
      ...content,
      id: previous.id,
      schemaVersion: SCHEMA_VERSION,
      createdAt: previous.createdAt,
      updatedAt: now(),
    };

    activities[index] = activity;
    write(activities);
    return activity;
  }

  function deleteActivity(id) {
    const activities = read();
    const remaining = activities.filter((activity) => activity.id !== id);

    if (remaining.length === activities.length) return false;

    write(remaining);
    return true;
  }

  return {
    listActivities,
    getActivity,
    createActivity,
    updateActivity,
    deleteActivity,
  };
}

export const activityRepository = createActivityRepository();