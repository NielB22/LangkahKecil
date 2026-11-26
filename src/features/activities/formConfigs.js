import { isActivityType } from "./activityTypes.js";

function text(name, label, required = true, maxLength = 120) {
  return { name, label, type: "text", required, maxLength };
}

function select(name, label, options) {
  return { name, label, type: "select", required: true, options };
}

const collectionField = text(
  "collectionInstruction",
  "Arahan pengumpulan",
  false,
  300,
);

export const FORM_CONFIGS = {
  book: [
    text("subjectOrBook", "Nama buku / pelajaran"),
    {
      ...text("page", "Halaman", true, 30),
      placeholder: "Contoh: 15 atau 15–17",
    },
    {
      ...text("questionRange", "Nomor soal", true, 80),
      placeholder: "Contoh: 1–5 atau 1, 3, 5",
    },
    collectionField,
  ],

  drawing: [
    select("taskMode", "Jenis kegiatan", [
      { value: "drawing", label: "Menggambar" },
      { value: "coloring", label: "Mewarnai" },
    ]),
    text("object", "Objek gambar"),
    text("tools", "Alat dan bahan"),
    text("referenceNote", "Arahan / referensi dari guru", false, 300),
    collectionField,
  ],

  writing: [
    select("writingMode", "Jenis tulisan", [
      { value: "copy", label: "Menyalin" },
      { value: "short-story", label: "Cerita pendek" },
      { value: "summary", label: "Ringkasan" },
    ]),
    text("topic", "Topik / teks yang ditugaskan"),
    {
      ...text("lengthTarget", "Target panjang tulisan"),
      placeholder: "Contoh: 5 kalimat",
    },
    {
      ...text("writingMedium", "Media menulis", false),
      defaultValue: "Buku tulis",
    },
    collectionField,
  ],
};

export function getFormConfig(type) {
  return isActivityType(type) ? FORM_CONFIGS[type] : null;
}

export function createInitialFormData(type) {
  const fields = getFormConfig(type);
  if (!fields) return {};

  return Object.fromEntries(
    fields.map((field) => [
      field.name,
      field.defaultValue ??
        (field.type === "select" ? field.options[0].value : ""),
    ]),
  );
}