import test from "node:test";
import assert from "node:assert/strict";
import { generateActivity } from "../src/features/activities/generators.js";
import { isAllowedIcon } from "../src/features/activities/activityTypes.js";

function bookInput() {
  return {
    type: "book",
    title: "Latihan Matematika",
    formData: {
      subjectOrBook: "Matematika",
      page: "15",
      questionRange: "1–5",
      collectionInstruction: "Letakkan buku di meja guru",
    },
  };
}

test("mempertahankan rincian tugas dan urutan kartu", () => {
  const activity = generateActivity(bookInput());

  assert.equal(activity.steps.length, 4);
  assert.equal(activity.steps[0].instruction, "Siapkan buku Matematika.");
  assert.equal(activity.steps[1].instruction, "Buka halaman 15.");
  assert.equal(activity.steps[2].instruction, "Kerjakan soal nomor 1–5.");
  assert.equal(
    activity.steps[3].instruction,
    "Letakkan buku di meja guru",
  );

  assert.equal(new Set(activity.steps.map((step) => step.id)).size, 4);
  assert.ok(activity.steps.every((step) => isAllowedIcon(step.icon)));
});

test("input sama menghasilkan isi sama tanpa mengubah input", () => {
  const input = bookInput();
  const original = structuredClone(input);
  const first = generateActivity(input);
  const second = generateActivity(input);

  const content = (activity) =>
    activity.steps.map(({ id, ...step }) => step);

  assert.deepEqual(content(first), content(second));
  assert.deepEqual(input, original);
  assert.notEqual(first.id, second.id);
});

test("arahan pengumpulan kosong menggunakan teks netral", () => {
  const input = bookInput();
  input.formData.collectionInstruction = "";

  const activity = generateActivity(input);

  assert.equal(
    activity.steps[3].instruction,
    "Kumpulkan tugas sesuai arahan guru.",
  );
});

test("menolak halaman kosong dan rentang soal terbalik", () => {
  const input = bookInput();
  input.formData.page = "";
  assert.throws(() => generateActivity(input));

  input.formData.page = "15";
  input.formData.questionRange = "5–1";
  assert.throws(() => generateActivity(input));
});

test("menggambar dan mewarnai memakai tindakan berbeda", () => {
  const input = {
    type: "drawing",
    title: "Kegiatan Seni",
    formData: {
      taskMode: "drawing",
      object: "pemandangan alam",
      tools: "kertas dan pensil warna",
      referenceNote: "Gunakan contoh dari guru",
      collectionInstruction: "",
    },
  };

  const drawing = generateActivity(input);

  input.formData.taskMode = "coloring";
  const coloring = generateActivity(input);

  assert.equal(
    drawing.steps[0].instruction,
    "Siapkan kertas dan pensil warna.",
  );
  assert.equal(
    drawing.steps[1].instruction,
    "Gambarlah pemandangan alam.",
  );
  assert.equal(
    coloring.steps[1].instruction,
    "Warnai gambar pemandangan alam.",
  );
  assert.equal(
    drawing.steps[1].helpText,
    "Gunakan contoh dari guru",
  );
});

test("tiga mode menulis mempertahankan topik dan target", () => {
  const modes = [
    ["copy", "Salin"],
    ["short-story", "Tulis cerita pendek"],
    ["summary", "Tulis ringkasan"],
  ];

  for (const [writingMode, expectedVerb] of modes) {
    const activity = generateActivity({
      type: "writing",
      title: "Latihan Menulis",
      formData: {
        writingMode,
        topic: "liburan sekolah",
        lengthTarget: "5 kalimat",
        writingMedium: "buku tulis",
        collectionInstruction: "",
      },
    });

    assert.ok(activity.steps[1].instruction.startsWith(expectedVerb));
    assert.ok(activity.steps[1].instruction.includes("liburan sekolah"));
    assert.ok(activity.steps[1].instruction.includes("5 kalimat"));
    assert.ok(activity.steps.every((step) => isAllowedIcon(step.icon)));
  }
});

test("menolak pilihan mode yang tidak tersedia", () => {
  assert.throws(() =>
    generateActivity({
      type: "writing",
      title: "Latihan",
      formData: {
        writingMode: "mode-tidak-valid",
        topic: "Liburan",
        lengthTarget: "5 kalimat",
      },
    }),
  );
});