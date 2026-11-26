import { validateBuilderInput } from "./validators.js";
import { SCHEMA_VERSION } from "./models.js";

function makeStep(title, instruction, helpText, icon) {
  return {
    id: crypto.randomUUID(),
    title,
    instruction,
    helpText,
    icon,
  };
}

function generateBookSteps(formData) {
  const {
    subjectOrBook,
    page,
    questionRange,
    collectionInstruction,
  } = formData;

  return [
    makeStep(
      "Siapkan buku",
      `Siapkan buku ${subjectOrBook}.`,
      "Cari bukunya di tas atau meja.",
      "book",
    ),
    makeStep(
      "Buka halaman",
      `Buka halaman ${page}.`,
      "Lihat nomor halaman di bagian atas atau bawah kertas.",
      "book-open",
    ),
    makeStep(
      "Kerjakan soal",
      `Kerjakan soal nomor ${questionRange}.`,
      "Kerjakan soal satu per satu.",
      "pencil",
    ),
    makeStep(
      "Kumpulkan tugas",
      collectionInstruction || "Kumpulkan tugas sesuai arahan guru.",
      "Jika belum jelas, tanyakan tempat pengumpulan kepada guru.",
      "check-circle",
    ),
  ];
}

function generateDrawingSteps(formData) {
  const {
    taskMode,
    object,
    tools,
    referenceNote,
    collectionInstruction,
  } = formData;

  const coloring = taskMode === "coloring";

  return [
    makeStep(
      "Siapkan alat dan bahan",
      `Siapkan ${tools}.`,
      "Periksa alat dan bahan yang diminta guru.",
      "palette",
    ),
    makeStep(
      coloring ? "Warnai gambar" : "Mulai menggambar",
      coloring ? `Warnai gambar ${object}.` : `Gambarlah ${object}.`,
      referenceNote || "Kerjakan satu bagian terlebih dahulu.",
      coloring ? "palette" : "image",
    ),
    makeStep(
      "Periksa hasil",
      "Periksa kembali hasil pekerjaanmu.",
      "Lihat apakah tugas sudah sesuai arahan guru.",
      "eye",
    ),
    makeStep(
      "Kumpulkan tugas",
      collectionInstruction || "Kumpulkan tugas sesuai arahan guru.",
      "Jika belum jelas, tanyakan tempat pengumpulan kepada guru.",
      "check-circle",
    ),
  ];
}

function generateWritingSteps(formData) {
  const {
    writingMode,
    topic,
    lengthTarget,
    writingMedium,
    collectionInstruction,
  } = formData;

  const modes = {
    copy: {
      title: "Salin tulisan",
      instruction: `Salin ${topic} sebanyak ${lengthTarget}.`,
      help: "Lihat teks contoh dari guru. Salin satu bagian dahulu.",
    },
    "short-story": {
      title: "Tulis cerita",
      instruction:
        `Tulis cerita pendek tentang ${topic} sepanjang ${lengthTarget}.`,
      help: "Mulai dengan satu kalimat tentang topik tersebut.",
    },
    summary: {
      title: "Tulis ringkasan",
      instruction:
        `Tulis ringkasan tentang ${topic} sepanjang ${lengthTarget}.`,
      help: "Cari gagasan utama pada bahan yang diberikan guru.",
    },
  };

  const selected = modes[writingMode];

  return [
    makeStep(
      "Siapkan media menulis",
      writingMedium
        ? `Siapkan ${writingMedium}.`
        : "Siapkan media menulis sesuai arahan guru.",
      "Pastikan alat tulismu siap digunakan.",
      "pencil",
    ),
    makeStep(
      selected.title,
      selected.instruction,
      selected.help,
      "file-text",
    ),
    makeStep(
      "Periksa tulisan",
      "Baca kembali tulisanmu.",
      "Periksa apakah isi dan panjang tulisan sudah sesuai tugas.",
      "clipboard-check",
    ),
    makeStep(
      "Kumpulkan tugas",
      collectionInstruction || "Kumpulkan tugas sesuai arahan guru.",
      "Jika belum jelas, tanyakan tempat pengumpulan kepada guru.",
      "check-circle",
    ),
  ];
}

const generators = {
  book: generateBookSteps,
  drawing: generateDrawingSteps,
  writing: generateWritingSteps,
};

export function generateActivity(input) {
  const result = validateBuilderInput(
    input.type,
    input.title,
    input.formData,
  );

  if (!result.valid) {
    const error = new Error("Periksa kembali isian formulir.");
    error.fieldErrors = result.errors;
    throw error;
  }

  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    schemaVersion: SCHEMA_VERSION,
    title: result.data.title,
    type: result.data.type,
    language: "id-ID",
    formData: result.data.formData,
    steps: generators[result.data.type](result.data.formData),
    createdAt: now,
    updatedAt: now,
  };
}