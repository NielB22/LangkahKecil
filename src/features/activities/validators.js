import { getFormConfig } from "./formConfigs.js";
import { LIMITS } from "./models.js";
import { isAllowedIcon } from "./activityTypes.js";

function isNumberOrRange(value) {
  const pattern = /^[1-9]\d{0,3}(?:\s*[-–]\s*[1-9]\d{0,3})?$/;
  if (!pattern.test(value)) return false;

  const numbers = value.split(/\s*[-–]\s*/).map(Number);
  return numbers.length === 1 || numbers[0] <= numbers[1];
}

function isQuestionList(value) {
  return value
    .split(",")
    .every((part) => isNumberOrRange(part.trim()));
}

export function validateBuilderInput(type, rawTitle, rawFormData) {
  const fields = getFormConfig(type);
  const errors = {};

  if (!fields) {
    return {
      valid: false,
      errors: { type: "Pilih jenis aktivitas yang tersedia." },
      data: null,
    };
  }

  const title = typeof rawTitle === "string" ? rawTitle.trim() : "";

  if (!title) {
    errors.title = "Judul aktivitas wajib diisi.";
  } else if (title.length > LIMITS.activityTitle) {
    errors.title = `Judul maksimal ${LIMITS.activityTitle} karakter.`;
  }

  const source =
    rawFormData &&
    typeof rawFormData === "object" &&
    !Array.isArray(rawFormData)
      ? rawFormData
      : {};

  const formData = {};

  for (const field of fields) {
    const raw = source[field.name];
    const value = typeof raw === "string" ? raw.trim() : "";
    formData[field.name] = value;

    if (raw !== undefined && typeof raw !== "string") {
      errors[field.name] = `${field.label} harus berupa teks.`;
      continue;
    }

    if (field.required && !value) {
      errors[field.name] = `${field.label} wajib diisi.`;
      continue;
    }

    if (field.maxLength && value.length > field.maxLength) {
      errors[field.name] =
        `${field.label} maksimal ${field.maxLength} karakter.`;
      continue;
    }

    if (
      field.type === "select" &&
      !field.options.some((option) => option.value === value)
    ) {
      errors[field.name] = `Pilih ${field.label.toLowerCase()} yang tersedia.`;
    }
  }

  if (type === "book") {
    if (!errors.page && !isNumberOrRange(formData.page)) {
      errors.page =
        "Gunakan halaman 1–9999 atau rentang menaik, misalnya 15–17.";
    }

    if (
      !errors.questionRange &&
      !isQuestionList(formData.questionRange)
    ) {
      errors.questionRange =
        "Gunakan nomor 1–9999, rentang menaik, atau daftar: 1–5 atau 1, 3, 5.";
    }
  }

  const valid = Object.keys(errors).length === 0;

  return {
    valid,
    errors,
    data: valid ? { title, type, formData } : null,
  };
}

export function validateSteps(steps) {
  const errors = {};

  if (
    !Array.isArray(steps) ||
    steps.length < LIMITS.minSteps ||
    steps.length > LIMITS.maxSteps
  ) {
    return {
      valid: false,
      errors: {
        general: `Aktivitas harus memiliki ${LIMITS.minSteps}–${LIMITS.maxSteps} kartu.`,
      },
    };
  }

  const ids = new Set();

  steps.forEach((step, index) => {
    const issues = {};

    if (!step || typeof step !== "object" || Array.isArray(step)) {
      errors[index] = { instruction: "Data kartu tidak valid." };
      return;
    }

    if (
      typeof step.id !== "string" ||
      !step.id.trim() ||
      ids.has(step.id)
    ) {
      issues.id = "ID kartu tidak valid atau duplikat.";
    }
    ids.add(step.id);

    for (const [field, limit] of [
      ["title", LIMITS.stepTitle],
      ["instruction", LIMITS.instruction],
      ["helpText", LIMITS.helpText],
    ]) {
      if (typeof step[field] !== "string") {
        issues[field] = "Isian harus berupa teks.";
      } else if (step[field].length > limit) {
        issues[field] = `Maksimal ${limit} karakter.`;
      }
    }

    if (
      typeof step.instruction === "string" &&
      !step.instruction.trim()
    ) {
      issues.instruction = "Instruksi utama wajib diisi.";
    }

    if (!isAllowedIcon(step.icon)) {
      issues.icon = "Pilih ikon yang tersedia.";
    }

    if (Object.keys(issues).length) errors[index] = issues;
  });

  return { valid: Object.keys(errors).length === 0, errors };
}