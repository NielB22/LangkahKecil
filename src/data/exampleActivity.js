export const ICON_OPTIONS = [
  ["book", "Buku"],
  ["pencil", "Pensil"],
  ["paper", "Kertas"],
  ["scissors", "Gunting"],
  ["ruler", "Penggaris"],
  ["backpack", "Tas"],
  ["desk", "Meja"],
  ["chair", "Kursi"],
  ["hand", "Tangan"],
  ["eye", "Mata"],
  ["ear", "Telinga"],
  ["speech", "Berbicara"],
  ["walk", "Berjalan"],
  ["wash-hands", "Cuci tangan"],
  ["water", "Air"],
  ["clock", "Waktu"],
  ["check", "Selesai"],
  ["shapes", "Simbol umum"],
];

export function createEmptyStep() {
  return {
    id: crypto.randomUUID(),
    title: "",
    instruction: "",
    help: "",
    icon: "shapes",
  };
}

export function createExampleActivity() {
  const now = new Date().toISOString();

  const steps = [
    {
      title: "Ambil buku matematika",
      instruction: "Ambil buku matematika milikmu.",
      help: "Cari buku yang digunakan untuk pelajaran matematika.",
      icon: "book",
    },
    {
      title: "Buka halaman 15",
      instruction: "Buka buku pada halaman 15.",
      help: "Cari angka 15 pada halaman buku.",
      icon: "book",
    },
    {
      title: "Kerjakan soal 1 sampai 3",
      instruction: "Kerjakan soal nomor 1, 2, dan 3.",
      help: "Mulai dari soal nomor 1.",
      icon: "pencil",
    },
    {
      title: "Kumpulkan buku",
      instruction: "Letakkan buku di meja guru.",
      help: "Bawa bukumu ke meja guru.",
      icon: "desk",
    },
  ];

  return {
    schemaVersion: 1,
    id: crypto.randomUUID(),
    title: "Belajar Matematika",
    sourceInstruction:
      "Ambil buku matematika, buka halaman 15, kerjakan nomor 1 sampai 3, lalu kumpulkan di meja guru.",
    language: "id-ID",
    detailLevel: "simple",
    source: "example",
    status: "draft",
    revision: 1,
    approvedRevision: null,
    approvedAt: null,
    createdAt: now,
    updatedAt: now,
    steps: steps.map((step) => ({
      ...step,
      id: crypto.randomUUID(),
    })),
  };
}